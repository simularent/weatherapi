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
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Closed the database connection.');
});

let apiKey = '92170456d98957d0386278d266fe5a9e';
let city = argv.c || 'portland';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let weather = JSON.parse(body);
    let temp = `${weather.main.temp}` ;
    console.log(temp);
    console.log(weather);
  }
});