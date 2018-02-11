// importing modules
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json") // config file

// connect to the database
const mysql = require("mysql");
var con = mysql.createConnection(config.sql);

con.connect((err) => {
	if (err) throw err;

	// get list of employees that have invites unsent
	con.query("SELECT `employee`, `session` FROM `invite` WHERE `sent` IS NULL", (err, result, fields) => {
		console.log(client.guilds.get(config.server));
	});
});
