// importing modules
const Discord = require("discord.js");
const http = require("http");

// importing files
const config = require("./config.json") // config file
const tempus = require("./tempus.js"); // actually does the things
const helpers = require("./helpers.js"); // bunch of helper functions

// Connections
const client = new Discord.Client();

const server = http.createServer( (request, response) => {

	console.log("I HAVE BEEN POKED");

	if (request.method == "POST") {
		// if POST method used
		request.on("data", data => {
			const commands = JSON.parse(data.toString());

			commands.forEach(command => {
				// find function
				if (tempus.hasOwnProperty(command[0])) {
					// stores the function
					const func = tempus[command[0]];
					// replaces the function name with the client
					command[0] = client;
					// applies args and executes
					try 		{ func.apply(null, command); }
					catch (err) { console.error(`Error while executing ${command[0]}: ${err}`); }
				} else
					console.error(`Couldn't find function: ${command[0]}`);
			});
		});
	}
});

var port = 3000;
var host = "127.0.0.1";
server.listen(port, host);
console.log(`Listening at http://${host}:${port}`);

// starting actions
client.on("ready", evnt => {
	console.log("Bot started");
});

// load commands
client.on("message", message => {
	if (message.content[0] !== config.prefix) return; // ignores non-commands

	// "!roll test 1 2" => { "command": "roll", "args": ["test", 1, 2] }
	const details = helpers.proccessCommand(message);

	// actual running
	helpers.run(details.command, client, message, details.args);

	// logging
	helpers.log(details.command, details.args);
});

// login
client.login(config.token);
