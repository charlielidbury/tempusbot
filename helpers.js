exports.proccessCommand = (message) => {
	// "!roll test 1 2"
	const no_prefix = message.content.slice(1);
	// "roll test 1 2"
	const as_array = no_prefix.split(" ");
	// ["roll", "test", "1", "2"]
	const args = as_array.map(element => { try {return JSON.parse(element);} catch (err) {return element;} });
	// ["roll", "test", 1, 2]
	const command = args.shift();
	// ["test", 1, 2]

	return {"command": command, "args": args};
}

exports.log = (command, args) =>
	console.log(`Command run: ${command}, args: ${JSON.stringify(args)} @ ${new Date()}`);

exports.run = (command, client, message, args) => {
	try {
		// finds command file and runs the run function in it
		const commandFile = require(`./commands/${command}`);
		commandFile.run(client, message, args);
		delete require.cache[require.resolve(`./commands/${command}`)];

	} catch (err) {
		// tells the user the command doesn't exist
		if (err.code == "MODULE_NOT_FOUND")
			message.reply(`Unrecognised command: '${command}', use '!help' for list of commands.`);
		else
			console.error(err);
	}
}
