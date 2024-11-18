---
title: Playing with PostGIS
date: 2018-01-12 00:00:00 Z
categories:
- Tech
author: nwolverson
layout: default_post
summary: 'I show a simple use of the PostGIS Postgres database extension to combine route data from Strava and postcode data.

  '
---

### The idea

I've spent some time in the past playing with mapping in various forms, mostly in a fairly straightforward way, using an existing mapping library like [google maps](https://developers.google.com/maps/documentation/javascript/) or [leaflet.js](http://leafletjs.com/) and throwing a bunch of markers at the screen.

I wanted an excuse to play with [PostGIS](https://postgis.net/), and my thoughts were as follows: analyse some of my running routes (pulled from [Strava](http://strava.com)) and find out what X were nearby - but I didn't have an idea what X was. How about what postcodes the route travels through? Of course real postcode data is hilariously expensive, but I found [a blog post](https://longair.net/blog/2017/07/10/approximate-postcode-boundaries/) decomposing the country into a Voronoi diagram of postcodes (really, read the post to unpack that).

It should be said that GIS is a substantial field in its own right, and here I'm just dipping a toe in to see how I can leverage some relevant tools.

### Importing postcode data

I spun up a PostGIS database using the [mdillon/postgis](https://hub.docker.com/r/mdillon/postgis/) Docker image, so the first task is to import the postcode data. [Mark](https://longair.net/blog/2017/07/10/approximate-postcode-boundaries/) provides a `.tar.bz2` full of KML files for each postcode [area, district, sector and unit](https://en.wikipedia.org/wiki/Postcodes_in_the_United_Kingdom#Formatting), and I could have used the [ogr2ogr](http://www.gdal.org/ogr2ogr.html) tool to import each into the database, instead I chose to write a little Java code to iterate over these files and insert into the database using PostGIS function 
[`ST_GeomFromKML`](https://postgis.net/docs/manual-2.4/ST_GeomFromKML.html) to convert from KML. I'll admit this took a little while, as there are 1.7M postcodes in the dataset.

### Strava integration

Strava provides a pretty decent API for accessing your data, you set up an OAuth2 application and the user can authorise Strava to be able to access basically anything the user themselves could see in the UI. So I set up a Spring Boot application to authenticate via Strava OAuth (really some configuration and slapping on an `@EnableOAuth2Sso` annotation). A [Java library](https://github.com/danshannon/javastravav3api) wrapping the Strava API is available, and after initialising this with the Spring Security session's OAuth token, returning a list of activities is easy:

~~~java
    @RequestMapping("/activities")
    public List<ActivitySummary> index() {
        Strava strava = stravaCtx.getStrava();
        return strava.listAuthenticatedAthleteActivities().stream()
                .map(ActivitySummary::new)
                .collect(Collectors.toList());
    }
~~~

Of course this is just an anaemic wrapper over the Strava API, but after we analyse the data we can add a more interesting endpoint.

The data we're interested in is the actual route itself, a sequence of lat/lng coordinates, which looks like this:

~~~java
String polyline = strava.getActivity(id).getMap().getPolyline();
~~~

This is in the [Google Maps encoded polyline format](https://developers.google.com/maps/documentation/utilities/polylinealgorithm), which happily PostGIS supports.

### Querying the data

Now we get to what I actually wanted to do (as always these things grow legs).

Revisiting the data, we have a Postgres database with a table something like this

~~~sql
CREATE TABLE voronoi_postcodes
(
	gid SERIAL PRIMARY KEY,
    shape geography(MULTIPOLYGON),
    name TEXT
);
~~~

The point of a spatial database is to store, index and query spatial data, and in order to do this efficiently we can create a spatial index:

~~~sql
CREATE INDEX idx_shape ON voronoi_postcodes USING gist ( shape )
~~~

The spatial index allows an index scan to be done on the table using the bounding boxes of the geometries in question, for appropriate queries, and many standard functions are constructed such that they first perform this coarse (fast) bounding-box test before verifying the precise result.

We can extract the postcode geometries intersecting with an input polyline as follows:

~~~sql
SELECT st_asgeojson(shape) FROM voronoi_postcodes, 
	(SELECT ST_LineFromEncodedPolyline(?) as path)
    WHERE st_intersects(shape, path)
~~~

We take this in GeoJSON format as this will plug into our JS map UI easily.

This does still take a couple of seconds with the couple million postcodes - having spent little time optimising I'd hope this could be better, we can at least check that the spatial index is being used with `explain analyze`:

~~~
Nested Loop  (cost=0.41..247828.35 rows=704749 width=32) (actual time=6.573..2525.666 rows=102 loops=1)
  ->  Seq Scan on routes  (cost=0.00..22.70 rows=1270 width=32) (actual time=0.003..0.005 rows=1 loops=1)
  ->  Index Scan using idx_shape on voronoi_postcodes pc  (cost=0.41..193.19 rows=55 width=168) (actual time=6.549..2523.762 rows=102 loops=1)
        Index Cond: (shape && routes.path)
        Filter: (_st_distance(shape, routes.path, '0'::double precision, false) < '1.00000000000000008e-05'::double precision)
        Rows Removed by Filter: 1199
Planning time: 0.383 ms
Execution time: 2525.777 ms
~~~

### Displaying the UI

We can slot in some JavaScript maps library to display the path and the postcode polygons on top of a base map, and in this case [leaflet.js](http://leafletjs.com/) will do the job. Leaflet permits a polyline layer, and throwing together a React app with [React-leaflet](https://react-leaflet.js.org/) and [material-ui](http://material-ui-next.com/) we get something like this:

![Running route with postcode areas highlighted]({{site.baseurl}}/nwolverson/assets/postgis/sample-postcode-run.png)

### Summing up

While the data import and plumbing together an application took some time, the key aspect of downloading routes from Strava, using them to filter a sizeable spatial database, and serving them up in a format to be consumed by a map UI, was actually pretty straightforward.

Next I need to maybe make use of a few more interesting spatial functions, and actually come up with an application that's more useful than curiosity...

The application talked about here is currently [available here](http://nwolverson.uk:8081).