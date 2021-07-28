// use request to pull data from the OpenWeather API
const request = require('request');

// use yargs to allow the user to manipulate our JS with arguments
const argv = require('yargs').argv;

// use sqlite3 as our backend db
const sqlite3 = require('sqlite3').verbose();

// get the api key, city, and url setup for openweathermap (our current data source for temperature)
let apiKey = '92170456d98957d0386278d266fe5a9e';
let city = argv.c || 'portland';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;


// create and open the database
let db = new sqlite3.Database('./weatherAPI.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
	  if (err) {
		      console.error(err.message);
		    }
	  console.log('Connected to the weatherAPI database.');
	  db.serialize(() => {
		db.run('CREATE TABLE weather (query_time TEXT, temperature TEXT, city TEXT, compdate INT, id INTEGER PRIMARY KEY)');
		db.all("select name from sqlite_master where type='table'", function (err, tables) {
	        console.log(tables);
	        });
	  });
});

runrequest();

function runrequest () {
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
                 DBclose();
            }
	});
};

function DBinsert(query_time, temperature, city, compdate) {
	        db.serialize
	        var stmt = db.prepare('INSERT INTO weather VALUES (?,?,?,?,?)');
	                    stmt.run(query_time,temperature,city,compdate);
	                    stmt.finalize();
        db.each('SELECT compdate, temperature, city, query_time, id FROM weather', function(err, row) {
	        console.log(row.compdate, row.temperature, row.city, row.query_time, row.id);
	        });
	};

function DBclose() { 
	db.close((err) => {
  	 if (err) {
    	  console.error(err.message);
  		}
  	console.log('Closed the database connection.');
});
};
