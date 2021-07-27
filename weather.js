// a weather API to check the temperature given a city with the -c argument, otherwise return
// the temperature in Portland, OR

// use request to pull data from the OpenWeather API
const request = require('request');

// use yargs to allow the user to manipulate our JS with arguments
const argv = require('yargs').argv;

// use sqlite3 as our backend db
const sqlite3 = require('sqlite3').verbose();

// create and open the database
let db = new sqlite3.Database('./weatherAPI.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
	  if (err) {
		      console.error(err.message);
		    }
	  console.log('Connected to the weatherAPI database.');
	  db.serialize(() => {
//		          db.run('DROP TABLE IF EXISTS weather');
		  	  db.run('CREATE TABLE IF NOT EXISTS weather (temp INT, city TEXT, date INT)');
		          });
});

// get the api key, city, and url setup for openweathermap (our current data source for temperature)
let apiKey = '92170456d98957d0386278d266fe5a9e';
let city = argv.c || 'portland';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

testdate();
runrequest();

function testdate () {
	db.each('SELECT temp, city, date FROM weather', function(err, row) {
        console.log(row.temp, row.city, row.date);
  });
};

function runrequest () {
	request(url, function (err, response, body) {
	  if(err){
		      console.log('error:', error);
		    } else {
			        let weather = JSON.parse(body);
			        let temp = `${weather.main.temp}` ;
			    	let city = `${weather.name}` ;
			        var date = new Date();
			        var ndate = date.toLocaleTimeString();
			        console.log(temp);
			    	console.log(city);
			    	console.log(ndate);
			    	DBinsert(temp, city, ndate);
			    	DBclose();
			      }
});
};

function DBinsert(temp, city, date) {
	var stmt = db.prepare('INSERT INTO weather VALUES (?,?,?)');
		    stmt.run(temp,city,date);
		    stmt.finalize();
	db.each('SELECT temp, city, date FROM weather', function(err, row) {
		      console.log(row.temp, row.city, row.date);
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
