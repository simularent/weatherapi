// use sqlite3 as our backend db
const sqlite3 = require('sqlite3').verbose();

// create and open the database
let db = new sqlite3.Database('./weatherAPI.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
	  if (err) {
		      console.error(err.message);
		    }
	  console.log('Connected to the weatherAPI database.');
	  db.serialize(() => {
db.run('DROP TABLE IF EXISTS weather');
db.run('CREATE TABLE IF NOT EXISTS weather (temp INT, city TEXT, date INT, id PRIMARY KEY)');
		          });
});

function DBclose() { 
	db.close((err) => {
  	 if (err) {
    	  console.error(err.message);
  		}
  	console.log('Closed the database connection.');
});
};
