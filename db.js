const mysql = require("mysql");
const config = require("./config.json");

var con = mysql.createConnection(config.sql);

con.connect((err) => {
	if (err) throw err;
});

exports.query = (sql) => {
	/*
	Returns the result of query

	sql <= Query to be executed (? in place of arguments)
	args <= Array of arguments to replace the ?'s in sql
	returns => mysql result object
	*/

	con.query(sql, function (err, result, fields) {
		if (err) throw err;
		console.log(err);
		console.log(result);
		console.log(fields);
		console.log(sql);
		return result;
	});
}
