// a weather API to check the temperature given a city with the -c argument, otherwise return
// the temperature in Portland, OR
// add a few things that we need
const express = require('express');
const app = express();
const port = 80;

// use request to pull data from the OpenWeather API
const request = require('request');

// use yargs to allow the user to manipulate our JS with arguments
const argv = require('yargs').argv;

// use sqlite3 as our backend db
const sqlite3 = require('sqlite3').verbose();

// create db connection
let db = new sqlite3.Database('./weatherAPI.db', sqlite3.OPEN_READWRITE, (err) => {
	          if (err) {
	                   console.error(err.message);
	                   }
		           console.log('connected to the sqlite weatherAPI database.');
});

// get the api key, city, and url setup for openweathermap (our current data source for temperature)
let apiKey = '92170456d98957d0386278d266fe5a9e';

// CLI PARAMETER - the city can be overidden here if the admin sees fit, the url parameter "city" can still overide this setting via a web request
var usercity = argv.c || 'Portland';

// CLI PARAMETER - the debug mode is set here - see comment below
let debug = argv.m || 'nodebug';

// openweathermap URL for external temperature query
var url = `http://api.openweathermap.org/data/2.5/weather?q=${usercity}&units=imperial&appid=${apiKey}`;

//quick and easy debug on - off switch - use 'node weather.js -c Detroit -m debug' the default is not to activate debug
if (debug === 'nodebug') {
             console.log = function () {};
             }

// PROMISE - 1 second pause to go and grab our external temperature
function resolveAfter1Seconds() {
	  return new Promise(resolve => {
		      setTimeout(() => {
			            resolve('temp check complete');
			          }, 1000);
		    });
}

// function to initiate and report on the asyncCall function
async function asyncCall() {
	  console.log('temp check initiated');
	  const result = await resolveAfter1Seconds();
	  console.log(result);
	}

// entry point via http get to the /temperature express route
app.get('/temperature', (req, res) => {
	var usercity = req.query.city || 'Portland';
	async function asyncCall() {
			          console.log('running testdate function');
				  testdate(usercity);
			          const result = await resolveAfter1Seconds();
			          console.log(result);
				  var sql = "SELECT query_time, temperature, city FROM weather ORDER BY id DESC LIMIT 1"
			          var params = []
			            db.all(sql, params, (err, rows) => {
			            	if (err) {
					res.status(400).json({"error":err.message});
					return;
					      }
					res.json({
					          "data":rows
					                        })
					});
			        }
	        		asyncCall();
});

// this will check the latest db entry based on the primary key in descending order and limit 1 row for the query_time
// and compare it to whatever time NWEA has specified, in this example - 5 minutes
function testdate (usercity) {
	console.log("getting latest date");
	db.each('SELECT temperature, city, compdate, id FROM weather ORDER BY id DESC LIMIT 1', function(err, row) {
 	var date = new Date();
	//data from database
	console.log("db: " + row.compdate)
	console.log("current date: " + date)
		
	var FIVE_MIN=1*30*1000;
		
	if((date - new Date(row.compdate)) > FIVE_MIN || usercity != row.city) {
	let apiKey = '92170456d98957d0386278d266fe5a9e';
	var url = `http://api.openweathermap.org/data/2.5/weather?q=${usercity}&units=imperial&appid=${apiKey}`;
	   runrequest(url);
		}
	});
};

// this will run the request that connects to the openweathermap API and return JSON data related to our query
// in this case, the temperature at a US city
function runrequest (url) {
	console.log(url);
	request(url, function (err, response, body) {
	  if(err){
		      console.log('error:', error);
		    } else {
			        let weather = JSON.parse(body);
			        let temperature = `${weather.main.temp}` ;
			    	let city = `${weather.name}` ;
			        var compdate = new Date();
			        var query_time = compdate.toLocaleTimeString();
			        console.log(temperature);
			    	console.log(city);
			    	console.log(compdate);
			    	console.log(query_time);
			    	DBinsert(query_time, temperature, city, compdate);
	//		    	DBclose();
			      }
});
};

// this will insert the data passed to it into the sqlite DB and if debug is enabled, read the data back
// to the console
function DBinsert(query_time, temperature, city, compdate) {
	db.serialize
	var stmt = db.prepare('INSERT INTO weather VALUES (?,?,?,?,?)');
		    stmt.run(query_time,temperature,city,compdate);
		    stmt.finalize();
	db.each('SELECT query_time, temperature, city, compdate, id FROM weather', function(err, row) {
		    console.log(row.query_time, row.temperature, row.city, row.compdate, row.id);
	});
};

// this will close the sqlite DB connection if desired
function DBclose() { 
	db.close((err) => {
  	 if (err) {
    	  console.error(err.message);
  		}
  	console.log('closed the database connection.');
});
};

// this will listen on a specified TCP/IP port for incoming requests
app.listen(port, () => {
	  console.log(`NWEA weatherAPI is up and running`)
})
