---
title: Cloud Carbon Footprint for On-Premise
date: 2024-05-28 00:00:00 Z
categories:
- Sustainability
author: mgriffin
summary: The Cloud Carbon Footprint tool also provides support for carbon calculations from On-Premise sources. I investigate how it works and list some pros and cons with its usage, along with some contributions we are hoping to make.
---

## Introduction

The Cloud Carbon Footprint tool was discussed in a [previous blog post](https://blog.scottlogic.com/2023/10/19/tools-for-measuring-cloud-carbon-emissions.html), as a third party method of estimating emissions associated with cloud workloads. However, it can also use data from [On-Premise](https://www.cloudcarbonfootprint.org/docs/on-premise) sources for its estimations. This blog post gives an overview of how it should be used and investigates how it works via testing and analysis of its code. I consider the issues with its use and list some contributions that could be made to improve it.

## Usage Overview

The system requires a .csv file as an input, which must contain a minimum set of columns, with Machine Name, cost, power usage effectiveness and CPU utilization being optional. If CPU Utilization is not specified then it is assumed to be 50% by default, which can also be configured to use a different amount for server, desktop, and laptop machine types.

Each row has a start and end time that covers the period it relates to, as well as daily, weekly, monthly, and annual uptime amounts in hours. This allows a row to cover a period where the hardware is only active some of the time. For example, you could generate a weekly .csv file for your company laptop which has eight daily hours, forty weekly hours etc.

This .csv file must then be passed to a command, which generates an output .csv file with estimated energy usage and CO2e emissions. This command is `yarn run estimate-on-premise-data --onPremiseInput <Input File Name>`. You can optionally add the argument `--onPremiseOutput <Output File Name>`.

## Testing

Using the [example .csv file](https://github.com/cloud-carbon-footprint/cloud-carbon-footprint/blob/trunk/packages/cli/src/__tests__/EstimateOnPremiseData/on_premise_data_input.test.csv) provided by CCF, the command line tool successfully created a corresponding estimations csv. This covers a period of 7 days, with 4 hours of daily uptime and 12 hours of weekly uptime, which suggests a system running 3 days a week. The monthly and annual uptime are both set to 36, which seems a little confusing. This possibly represents an example where only a monthly estimation was desired, but the tool forces all uptime types to be populated. The values are multiples of the daily calculated amounts so there does not appear to be any additional benefit to this other than convenience.

As I started to test out the tool using some generated .csv files, I often found that the process would fail. Very minimal information was given about what went wrong, the error message was simply: `Something went wrong: Input data is incorrect. Please check your input data file and try again.`. This wasn’t very helpful and necessitated investigating the source code to resolve the problem, which I will cover later.

The .csv input format does not appear to be an exact match for any standard input source and so required some additional work to prepare data for estimation. Thankfully this wasn’t too extensive a task, and with the help of some Python scripting using the [Pandas](https://pandas.pydata.org/) library, I was able to transform an exported SCCM spreadsheet into the minimum required data.

~~~python
import pandas as pd

# Convert from country codes in SCCM data to values required by CCF
COUNTRY_CODES = {  
    'AU': 'Australia',
    'CA': 'Canada',
    'FI': 'Finland',
    'FR': 'France',
    'DE': 'Germany',
    'IN': 'India',
    'IE': 'Ireland',
    'IL': 'Israel',
    'IT': 'Italy',
    'MY': 'Malaysia',
    'PL': 'Poland',
    'RO': 'Romania',
    'KR': 'South Korea',
    'ES': 'Spain',
    'SE': 'Sweden',
    'CH': 'Switzerland',
    'GB': 'United Kingdom',
    'US': 'United States'
}

def transform_data(df):
    # Any missing data will be populated with 'Unknown'
    df['cpuDescription'] = df['Processor Name'].fillna('Unknown')
    df['memory'] = df['RAM GB'].fillna('Unknown')
    df['machineType'] = df.Chassis.fillna('Unknown')
    df['startTime'] = df.LastLogon.fillna('Unknown')
    df['endTime'] = df.LastActiveTime.fillna('Unknown')
    df['country'] = df.Country.map(COUNTRY_CODES).fillna('Unknown')
    df['region'] = 'Unknown'
    df['machineName'] = df.Name.fillna('Unknown')
    # A standard 8 hour day expanded to weekly, monthly and annual amounts
    df['dailyUptime'] = 8
    df['weeklyUptime'] = 40
    df['monthlyUptime'] = 160
    df['annualUptime'] = 1920

    return df

def main(input_file, output_file, sheet_name):
    df = pd.read_excel(input_file, sheet_name=sheet_name)

    df = transform_data(df)

    df.to_csv(output_file, index=False)

if __name__ == "__main__":
    input_excel_file = "input.xlsx"
    output_csv_file = "output.csv"
    sheet_name = "sheet name"

    main(input_excel_file, output_csv_file, sheet_name)
~~~

## Code Analysis

### Input/Output

Despite the documentation stating that the input must be placed in the `packages/cli` folder of the tool, it uses the path directly so you can pass in an absolute path from outside of the tool. However, the output file name is combined with the process' current working directory, so there is not currently a way to control the output location.

It also uses the same default output file name each time so care may need to be taken to ensure that results are not overwritten. Because of this, another error that can occur is having the previous .csv file open in Excel, which prevents the new file from being written.

The whole csv file is read into memory at once, using the 'csvtojson' library – this was not a problem in my test cases but is something to bear in mind if dealing with an extremely large amount of data.

### Data Validation

The input data is first validated, checking that each row has the required columns and throwing an error if any are missing or contain an empty string. This turned out to be the problem with my generated .csv files, where not all entries were populated. Adding the row detail to the error at this point would be extremely helpful in identifying why a particular input file causes problems, especially when dealing with a large amount of data.

There was less extensive validation than I might have expected, like ensuring that the dates are in the required format. This may relate to the dates being formatted incorrectly in the output file.

### Report Generation

Apart from an entry function on the main App, the reporting is isolated in an on-premise package. It has a unique OnPremiseDataReport type, which is passed a standard ComputeEstimator and MemoryEstimator. These are the same classes that are used in the cloud calculations but here a specific on-premise memory coefficient is given to the MemoryEstimator. Currently the on-premise and all cloud providers use a value of 0.000392kWh / Gb but the system is setup so that they could be different.

### Processor families

The input CPU Description is used to get a Processor Family, which is split depending on whether ‘Intel’ or ‘AMD’ is found in the text. There are two machine type lookup objects that are specific to the on-premise package, which map to the following compute processor types from the core package.

| **Processor Family** |
| --- |
| Cascade Lake |
| Skylake |
| Broadwell |
| Haswell |
| Coffee Lake |
| Sandy Bridge |
| Ivy Bridge |
| AMD EPYC 1st Gen |
| AMD EPYC 2nd Gen |

#### AMD

If AMD is found in the description then the third word is used as the lookup key. Looking at some sample data, it appears that many of the AMD chips listed would not match this pattern – for example an ‘AMD PRO A8-8600B R6’ would give a potentially useful ‘A8-8600B’ (which isn’t listed in the code) but others might give a single number or an abbreviation like ‘APU’.

#### Intel

The Intel descriptions have a more complex process which attempts to remove ‘Intel(R)‘, ‘CPU’, and its clock speed from the description to leave a processor code only. Again, from my sample data, a description like ‘Intel(R) Core(TM) i5-7500 CPU @ 3.40GHz‘ should result in a lookup string of ‘i5-7500’ (which is also not supported). Others leave a ‘v2’ on the end preventing a match and a few like ‘Intel Pentium III Xeon processor’ do not produce a sensible key at all.

When neither manufacturer produces a result, an on-premise specific average is used instead. Also, even though a common processor type can be determined, these again have custom coefficients for on-premises usage.

### Region Data

The input requires a country and a region but unless the country is 'United States' then the region is discarded. If it is, then the two are combined into a single string like 'United States-Texas'. This is then used in another on-premise specific lookup table to find the regional carbon intensity. There is an 'Unknown' region, which contains an average value that the code falls back on if the given region cannot be found.

There does not appear to be any facility to plug in a different set of emissions factors from an external source like [Electricity Maps](https://app.electricitymaps.com/map). The list is also quite limited, missing various countries that were present in my sample data. The full list of supported countries is:

| **Country** | **Tonnes CO2e per kWh** |
| --- | --- |
| Australia | 0.00096 |
| Canada | 0.0000186 |
| Finland | 0.00009532 |
| France | 0.00005128 |
| Germany | 0.00033866 |
| India | 0.0007082 |
| Ireland | 0.00033599 |
| Israel | 0.00046095 |
| Italy | 0.00032384 |
| Malaysia | 0.000408 |
| Poland | 0.00075962 |
| Romania | 0.00026184 |
| South Korea | 0.0004156 |
| Spain | 0.00017103 |
| Sweden | 0.00000567 |
| Switzerland | 0.00001152 |
| United Kingdom | 0.00021233 |
| United States | 0.00042394 |
| Unknown | 0.0003228315385 |

With the following regions supported for United States:

| **Region** | **Tonnes CO2e per kWh** |
| --- | --- |
| California | 0.00017562 |
| Virginia | 0.00028842 |
| Louisiana | 0.00037481 |
| Florida | 0.00039793 |
| Illinois | 0.00032921 |
| Texas | 0.00041432 |
| Washington | 0.00013567 |
| Ohio | 0.00056357 |
| Oregon | 0.00017562 |

Given that the validation forces you to put something in the region column, there is no way to use the base United States value on its own. If the region is not found in the above list, then it will again fall back on the global 'Unknown' average.

### Machine Type

The machine type can be specified as either server, desktop, or laptop. This can influence the CPU utilization and average watts used in calculations. If the type does not match one of these then this results in the CPU utilization being passed through (either specified on the row or the 50% default) and the Average watts being undefined, so that it is later calculated via:

Average Watts = Min Watts + (average CPU utilization / 100) \* (Max Watts - Min Watts)

If it does match one of the three types, then it will only have an effect if additional defaults have been configured like so:

~~~env
ON_PREMISE?: {
    SERVER?: {
        CPU_UTILIZATION?: number
        AVERAGE_WATTS?: number
    }
    LAPTOP?: {
        CPU_UTILIZATION?: number
        AVERAGE_WATTS?: number
    }
    DESKTOP?: {
        CPU_UTILIZATION?: number
        AVERAGE_WATTS?: number
    }
}
~~~

Then the CPU utilization and average watts will be overridden by these config values, skipping the calculation in the Compute Estimator. This seems a little surprising as it would be more natural to use these as fallback defaults, which would only be used if the CPU utilization was not specified on any given row.

### Start and End Times

These are required fields but do not appear to have any meaningful use currently. As mentioned in the validation section, the format is not checked and appears to only retain the hours, minutes, and milliseconds in the output data.

## Integration with the web application

At present the CLI tool is the only consumer of the on-premise reporting. While some of the Estimator classes are re-used, there is a lot of custom setup to use them, and on-premise specific coefficients used for computation. There is a [closed issue](https://github.com/cloud-carbon-footprint/cloud-carbon-footprint/issues/833) mentioning this but I don’t see any other indication that this is currently planned on the project backlog.

## Usage Considerations

### Positives

- Easy to generate information in required format.
- Does not block execution if given data does not match expectations.
- Uses the same core estimation code.

### Downsides

- Error messages are not obvious.
- Little transparency on when fallback averages have been used.
- Lots of lists of values specific to the on-premise calculations.
- No support for Carbon Intensity APIs.
- No integration with the API/Client application.
- Only supports Compute and Memory operational emissions – no storage, networking, or embodied carbon.

## Contributions we are considering

### Input/output
- Allow full file path specification for output so that nothing pollutes the tool folder.
- Attempt to write output to the same folder as the input file by default.
- Generate a unique name for each output file if a name is not specified.

### Validation
- Improve feedback when errors occur – list which column(s) were the issue and output the relevant row data.
- Relax requirement for all periods of Uptime, if at least one is present.
- Validate/Convert the start/end date fields and make sure they are output correctly.

### Transparency
- Populate the cpuUtilization and powerUsageEffectiveness for the output if they were not specified in the input. A fallback will have been used, which should be recorded.
- Include more information in the output – add columns for the selected carbon intensity/country and CPU energy coefficient/family name.

### Expand supported regions and hardware.
- Allow for more flexibility in the input country (use country codes etc.).
- Improve the code that breaks down CPU descriptions so that more of my sample data would match the given types (a Regex would probably be more consistent).
- Allow for sub regions outside of the United States (<https://carbonintensity.org.uk/> supports UK Postcodes and other named regions).
- Change the configured machine type defaults to be used as a fallback only when CPU utilization is not specified.

### Move the on-premise code to be more integrated with the cloud measurements.
- Allow for usage of electricity maps and other live APIs.
- Make use of start and end times to get specific Carbon Intensity if provided.
- Unify the on-premise specific Carbon Intensity values with those used for cloud estimation. Should allow the list to expand and allow easier maintenance.
- Same for identification of CPUS.

### Integrate the On-Premise code with the API/client.
- Add an API endpoint to submit a CSV file that can be added to the data cache.
  - To use pre-existing properties this could potentially list 'On-Premise' as Cloud Provider, &lt;Machine Name&gt; as Account, &lt;Machine Type&gt; as Service etc.
- Add client functionality to upload a CSV file.
- Add client functionality to view on-premise data.

## Conclusion

This tool was helpful in getting a high-level estimate of the associated carbon emissions based on a large list of hardware resources. The fact that the tool seamlessly falls back on average values is beneficial in being able to use the tool easily. However, it could be seen as lacking in transparency around the values used for its calculations. Combined with the amount of hardware and countries that are not supported means I would not recommend it for accurate reporting in its current form.

The lack of integration with the web application means that you would need to turn to another process to visualise the output. Adding support for on-premise data in the web application should be possible but could be a more significant amount of work than some other identified improvements.

I should caveat that I understand that a tool designed for measuring your 'cloud' carbon footprint might not have mature capabilities for on-premise measurement. This is an area without clear established standard tooling but is still an important aspect of many companies carbon footprint.

*[SCCM]: Microsoft System Center Configuration Manager