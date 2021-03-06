'use strict'

var async = require("async");
var AWS = require("aws-sdk");
var http = require("https");
var lambda = new AWS.Lambda({"region": "us-east-1"});
var crypto = require('crypto-js');
var format = require("string_format");
//var dateFormat = require('dateformat');

var privateKey = '6c454472cc985829b464b06c7dc908fc9f5ed8ec';
var publicKey = '22f8edbc735e0e4d217bd6ad0d808bc7';
var ts = new Date().getTime();
var hash = crypto.MD5(ts + privateKey + publicKey).toString();
var comicsUrl = "https://gateway.marvel.com:443/v1/public/characters/{0}/comics?limit=1&ts={1}&apikey={2}&hash={3}"; 
var s3 = new AWS.S3();
var bucket = "mmart-a7-bucket";
var table = "mmartMarvelTable";
var params, dynamoParams, json, id1, id2, key, lambdaCount = 0, startTime;

module.exports.get = (event, context, callback) => {

	startTime = new Date() + '';
	//startTime = dateFormat(startTime, "dddd, mmmm dS, yyyy, h:MM:ss TT");

	if (event.id1 < event.id2) {
		id1 = event.id1;
		id2 = event.id2;
	}
	else {
		id1 = event.id2;
		id2 = event.id1;
	}
	key = id1 + "_" + id2 + "_Comics.json";

	params = {
		Bucket: bucket, 
		Key: key
	};
	s3.getObject(params, function(err, data){
	    if(err) {
	    	console.log("Object does not exist!");
	    	var comicsUrl1 = comicsUrl.format(event.id1, ts, publicKey, hash);
			var comicsUrl2 = comicsUrl.format(event.id2, ts, publicKey, hash);
			async.parallel([
				function(callback) {
					async.waterfall([
						async.apply(getComics, comicsUrl1),
						async.apply(invokeLambdas, event.id1)
					], callback)
				},
				function(callback) {
					async.waterfall([
						async.apply(getComics, comicsUrl2),
						async.apply(invokeLambdas, event.id2)
					], callback)
				}],
				function(err, results) {
					json = JSON.stringify(results);
					callback(null, results);
					params = {
						Body: json, 
					  	Bucket: bucket, 
					  	Key: key
					};
					s3.putObject(params, function(err, data) {
					   	if (err) console.log(err, err.stack); 
					   	else     console.log("Successfully put object in " + params.Bucket);           
					});
					logResults(context.memoryLimitInMB, context.memoryLimitInMB);
				}
			);
	    }
	    else {
	    	console.log("Object already exists. Retrieving...");
	    	json = JSON.parse(data.Body.toString());
	      	callback(null, json);
	      	logResults(context.memoryLimitInMB, context.memoryLimitInMB);
	    }
	});
}

var logResults = function(memoryReservedMB, memoryUsedMB) {
	var endTime = new Date() + '';
	var functionName = 'ComicManager';
	//endTime = dateFormat(endTime, "dddd, mmmm dS, yyyy, h:MM:ss TT");
	dynamoParams = {
	  	TableName : table,
	  	Item: {
	    	Id: hash,
	    	Function: functionName,
	    	StartTime: startTime,
	     	EndTime: endTime,
	     	SingleQuantity: lambdaCount,
	     	Character1: id1,
	     	Character2: id2,
	     	MemoryReservedMB: memoryReservedMB,
	     	MemoryUsedMB: memoryUsedMB
	  }
	};
	var documentClient = new AWS.DynamoDB.DocumentClient();
	documentClient.put(dynamoParams, function(err, data) {
	  if (err) console.log(err);
	  else console.log('Successfully added ' + data + ' to ' + table);
	});
}

var getComics = function(url, callback) {
	var comicTotal;
	var errorMessage = "Data not found.";
	http.get(url, (res) => {
		res.setEncoding('utf8');
		var totalData = "";

		res.on("data", (data) => {
			totalData += data;
		});
		res.on("end", (data) => {
			var comics = JSON.parse(totalData);
			if (comics["data"]) {
				comicTotal = comics["data"]["total"];
				callback(null, comicTotal);
			}
			else {
				callback(errorMessage, null);
			}
		});
	})
}

var invokeLambdas = function(charId, comicCount, callback) {
	lambdaCount = Math.ceil(comicCount / 100);
	var tasks = [];

	for (let i = 0; i < lambdaCount; i++) {
		var offset = i*100;
		tasks.push(function(callback) {
			var payload = {
				charId: charId,
				offset: offset
			};
			var lambdaParams = {
				FunctionName : 'mig-service-dev-ComicSingle',
				InvocationType : 'RequestResponse',
				Payload: JSON.stringify(payload)
			};
			lambda.invoke(lambdaParams, function(error, data) {
				if (error) {
					callback(error);
				}
				else {
					callback(null, data);
				}
			});
		});
	}
	async.parallel(tasks,function(error, data) {
		if (error) {
			console.log(error);
		}
		else {
			var comics = [];
			for (let i = 0; i < data.length; i++) {
				comics = comics.concat(JSON.parse(data[i].Payload));
			}
			//console.log('Concat, Id: ' + charId);
			callback(null, comics);
		}
	});
}
