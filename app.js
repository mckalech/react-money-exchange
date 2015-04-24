var express = require('express');
var path = require('path'); 
var app = express();
var http = require('http');

app.set('port', (process.env.PORT || 3000))
app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function(){
	console.log('Express server');
});

app.get('/bids', function(req, res) {
	var newPairs = [];
	if(req.query && req.query.pairs){
		var pairs = req.query.pairs,
		i=0,
		queryString = "";
		for(;i<pairs.length;i++){
			queryString+=pairs[i]
			queryString+=','
		}
		//queryString = queryString.slice(0,-1);

		url = "http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22"+queryString+"%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

		http.get(url,function(response){
			response.setEncoding('utf8');
			response.on('data', function(chunk){
				results = JSON.parse(chunk).query.results.rate;
				console.log(results);
				for(i=0;i<results.length-1;i++){
					newPairs.push({
						name: results[i].Name.replace('/', ''),
						ask: results[i].Ask,
						bid:results[i].Bid
					});
				}
				res.setHeader('Content-Type', 'application/json');
				res.send(newPairs);
			});		
		})
	}else{
		res.setHeader('Content-Type', 'application/json');
		res.send(newPairs);
	}
	
	
});