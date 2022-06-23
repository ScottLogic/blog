---
title: ".NET for Apache Spark"
date: 2019-10-11 00:00:00 Z
categories:
- jharris
- Tech
author: jharris
summary: Taking a look at Microsoft's new product .NET for Apache Spark by writing
  a C# app that writes Spark dataframes to a SQL database.
layout: default_post
---

.NET for Apache Spark is a relatively new offering from Microsoft aiming to make the Spark data processing tool accessible to C# and F# developers with improved performance over [existing projects](https://github.com/Microsoft/Mobius).  I’m not a specialist in this area, but I have a bit of C# and PySpark experience and I wanted to see how viable .NET for Apache Spark is.

My starting point was the series of [video tutorials](https://dotnet.microsoft.com/learn/data/spark-tutorial/intro) on the Microsoft website and following the steps on there it was quite straightforward to set up a local dev environment for Spark on my Windows machine.  Here’s the code from the tutorial which was my starting point:

~~~csharp
	// Create a Spark session
	var spark = SparkSession
		.Builder()
		.AppName("word_count_sample")
		.GetOrCreate();
	
	// Create initial DataFrame
	DataFrame dataFrame = spark.Read().Text(string.Format("{0}.txt", inputFile));

	// Count words
	var words = dataFrame
		.Select(Functions.Split(Functions.Col("value"), " ").Alias("words"))
		.Select(Functions.Explode(Functions.Col("words"))
		.Alias("word"))
		.GroupBy("word")
		.Count()
		.OrderBy(Functions.Col("count").Desc());

	// Show results
	words.Show();

~~~

The code is very straightforward, it reads in a plain text file and performs a count of how often each word appears in the text and then prints the results.  In the past I’d always built my C# projects using the IDE but, as the tutorial suggested, I built this from the command line.  One benefit of building the project this way was that I could chain the build and the spark submit jobs together.

The task I’d been set was to persist the contents of the dataframe to a database. As a first step I decided to write the results to a file in a [columnar storage](https://docs.aws.amazon.com/athena/latest/ug/columnar-storage.html) format.  This would allow me to see my program working without having to set up a database just yet, and then I could read the files back  into a Spark dataframe to ensure they’d been persisted:

~~~csharp
	// Write results to orc file
	words.Write().Format("orc").Mode(SaveMode.Append).Save("wordcount.orc");

	DataFrame loadedDataFrame = spark.Read().Format("orc").Load("wordcount.orc");
	
	loadedDataFrame.Show();
			
~~~

The code is still very straightforward, but as is often the case the devil is hidden in the details.  The choice of Apache’s ORC format is important here because the default format, parquet, didn’t support the append operation, in fact it required the parquet files to be deleted manually before each run.  

Depending on the requirements, storing the results in ORC format might be fine and, like parquet, it’s a format that’s optimised for distributed storage and processing.  But ultimately I wanted to write the contents of my dataframe to a SQL database.

The .NET Spark.Sql library has support for writing dataframes straight to a SQL database using a jdbc connection.  This required downloading the drivers for the database in jar format, making them available on the classpath for spark and then telling the dataframe writer to use them:

~~~csharp

	// Write results to database
	var databaseProperties = new Dictionary<string, string>();
	databaseProperties.Add("user", dbUsername);
	databaseProperties.Add("password", dbPassword);
	databaseProperties.Add("driver", dbDriver);

	var tableName = "words";
		
	var dataFrameWriter = words.Write();
	dataFrameWriter.Mode(SaveMode.Append);

	dataFrameWriter.Jdbc(jdbcUrl, tableName, databaseProperties);
			
~~~

So job done, I was able to see the data in the database I’d set up. This quick experiment has shown that it’s viable to get a project up and talking to a database.  But as I mentioned at the start, .NET for Apache Spark is quite a new venture, only being [announced](https://devblogs.microsoft.com/dotnet/introducing-net-for-apache-spark/) this year (2019) and I was left with a definite feeling that the platform was lacking a bit of polish.

The documentation for .NET Spark library on MSDN is very barebones at the moment.  For example, take the Jdbc method on the [DataFrameWriter](https://docs.microsoft.com/en-us/dotnet/api/microsoft.spark.sql.dataframewriter.jdbc?view=spark-dotnet), which we used to write the results to the database.  A code example here would have really helped since it would have shown the format of the jdbc url and how to specify the required drivers, which took a fair amount of trial and error to get working.

This is a shame as .NET code tends to be documented in a pretty comprehensive manner, along with helpful code examples for hitting the ground running, which was one of the things I most liked about the framework when I’ve been developing in C#.

I’m sure that as the platform matures, the documentation and the tooling will improve.  If you’re happy to be an early adopter then .NET for Apache Spark it’s definitely workable, but bear in mind that at this stage you will very much be an early adopter and have all the experiences that goes with it, both good and bad.
