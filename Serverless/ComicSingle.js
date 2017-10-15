'use strict'

var async = require("async");
var AWS = require("aws-sdk");
var http = require("https");
var lambda = new AWS.Lambda({"region": "us-east-1"});
var crypto = require('crypto-js');
var format = require("string_format");

var privateKey = '6c454472cc985829b464b06c7dc908fc9f5ed8ec';
var publicKey = '22f8edbc735e0e4d217bd6ad0d808bc7';
var ts = new Date().getTime();
var hash = crypto.MD5(ts + privateKey + publicKey).toString();
var comicsUrl = "https://gateway.marvel.com:443/v1/public/characters/{0}/comics?limit=100&ts={1}&apikey={2}&hash={3}&offset=[4]"; 

module.exports.get = (event, context, callback) => {
	console.log(event);
	var url = comicsUrl.format(event.charId, ts, publicKey, hash, event.offset);
	getCharacterComics(url, callback);
}

var getCharacterComics = function(url, callback) {
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
				comicTotal = comics["data"]["results"].map(function(event) {
					return event.title;
				});
				callback(null, comicTotal);
			}
			else {
				callback(errorMessage, null);
			}
		});
	})
}