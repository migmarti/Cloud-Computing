var http = require('https');
var request = require('request');
var apiKey = "L9JyFoaQrUvDKSdGmMrMmyqicsOBNhVx5IaAGRED";
var url = 'https://api.nasa.gov/planetary/apod?api_key='+apiKey;
var fileStream = require('fs');

http.get(url, (res) => {
    res.setEncoding('utf8');
    res.on("data", (data) => {
        var info = JSON.parse(data);
        console.log("\nTitle: "+ info.title +
                    "\n\nExplanation: "+ info.explanation +
                    "\n\nCopyright: "+ info.copyright +
                    "\n\nDate: "+ info.date);
        console.log("\nDownloading image from: " + info.url);
        var request = http.get(info.url, function(response) {
            var file = fileStream.createWriteStream(info.title + ".jpg");
            response.pipe(file);
            console.log("Download complete. Saved on local directory.");
        });
    });
});