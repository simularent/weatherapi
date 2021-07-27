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
		db.all("select name from sqlite_master where type='table'", function (err, tables) {
		console.log(tables);
		});
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
