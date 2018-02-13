// importing modules
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json") // config file

function run(command, client, message, args){
	try {
		// finds command file and runs the run function in it
		var commandFile = require(`./commands/${command}`);
		commandFile.run(client, message, args);
		delete require.cache[require.resolve(`./commands/${command}`)];

	} catch (err) {
		// tells the user the command doesn't exist
		if (err.code == "MODULE_NOT_FOUND")
			message.reply(`Unrecognised command: '${command}', use '!help' for list of commands.`);
		else
			console.log(err);
	}
}

function log(command, args) {
	console.log(`Command run: ${command}, args: ` + JSON.stringify(args));
}

// load commands
client.on("message", (message) => {
	if (message.content[0] !== config.prefix) return; // ignores non-commands

	// "!roll test 1 2"
	var no_prefix = message.content.slice(1);
	// "roll test 1 2"
	var as_array = no_prefix.split(" ");
	// ["roll", "test", "1", "2"]
	var args = as_array.map(element => { try {return JSON.parse(element);} catch (err) {return element;} });
	// ["roll", "test", 1, 2]
	var command = args.shift();
	// ["test", 1, 2]

	// actual running
	run(command, client, message, args);

	// logging
	log(command, args);
});

// login
client.login(config.token);
