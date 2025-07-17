import math
import statistics
import copy

from pyspark import SparkConf, SparkContext

indexPostcode = 3
indexPrice = 1
indexDate = 2

header = ['Count', 'Mean', 'StDev', 'Min', 'Max']
outputHeader = ['Count', 'Mean', 'StDev', 'Median', 'Min', 'Max']

initialAggregate = [0, 0, 0, 10000000000, 0]

def addValue(current, value):
    return [
        current[0] + 1,
        current[1] + value,
        current[2] + value ** 2,
        min(current[3], value),
        max(current[4], value)]
        
def mergeAggregates(a, b):
    return [
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2],
        min(a[3], b[3]),
        max(a[4], b[4])]

def aggregateToArray(a):
    return [a[0], a[1] / a[0], math.sqrt(a[2] / a[0] - (a[1] / a[0]) ** 2), a[3], a[4]]

def mergeStats(dict, median):
    output = copy.copy(dict)
    output["Median"] = median
    return output

def main(sc):
    data = sc.textFile(r'C:\Downloads\pp-monthly-update-new-version.csv')\
        .map(lambda line: line.strip('"').split('","'))\
        .filter(lambda d: d[indexPostcode] != '') \
        .map(lambda d: (d[indexDate][0:4] + '_' + d[indexPostcode].split(' ')[0], int(d[indexPrice])))

    stats = data.aggregateByKey(initialAggregate, addValue, mergeAggregates)\
        .map(lambda kvp: (kvp[0], dict(zip(header, aggregateToArray(kvp[1])))))

    medians = data.groupByKey()\
        .map(lambda kvp: (kvp[0], statistics.median(kvp[1])))

    allStats = stats.join(medians).map(lambda kvp: (kvp[0], mergeStats(kvp[1][0], kvp[1][1])))

    csvData = allStats\
        .map(lambda kvp: kvp[0][0:4] + ',' + kvp[0][5:] + ',' + ",".join(map(str, map(lambda k: kvp[1][k], outputHeader))))

    sc.parallelize(['Year,Postcode,' + ",".join(outputHeader)])\
        .union(csvData)\
        .repartition(1)\
        .saveAsTextFile(r'C:\Downloads\pricePaidStatistics')

if __name__ == "__main__":
    conf = SparkConf().setAppName("PricePaidParser")
    conf = conf.setMaster("local[*]")
    sc = SparkContext(conf=conf)

    main(sc)
