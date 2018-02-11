exports.run = (client, message, args) => {
	const fs = require("fs");

	// gets the list of commands by reading all files in this directory, stripping them of their suffix,
	// adding a comma to the end and appending them all together with a little message.
	fs.readdir("./commands/", (err, items) => {
		message.reply("Available commands: " + items.map((element) => { return `'!${element.slice(0, -3)}'` }).join(", ") + ".");
	})
}
