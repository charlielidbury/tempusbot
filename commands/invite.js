exports.run = (client, message, args) => {
	if ((args[0] != "accept") && (args[0] != "decline")) {
		message.reply("Must specify 'accept' or 'decline'");
	} else {
		// imports
		const config = require("../config.json");
		const mysql = require("mysql");
		const tempus = require("../tempus.js");

		// finds the guildmember who sent the message
		const con = mysql.createConnection(config.sql);
		const server = client.guilds.get(config.server);
		const name = server.members.get(message.author.id).displayName;

		con.connect(err => {
			if (err) throw err;


			// adds the user to the channel if they accepted
			if (args[0] == 'accept') {
				const add_query = `SELECT DATE_FORMAT(session, "%Y-%m-%d") AS session FROM invite WHERE employee = "${name}" AND received IS NULL`;
				con.query(add_query, (err, result) => {
					if (err) throw err;

					result.forEach(row => tempus.addUser(client, row.session, name));
				});
			}

			// sets invite to accepted
			const update_query = `UPDATE invite SET received = NOW(), accepted = ${args[0] == 'accept'} WHERE employee = "${name}" AND received IS NULL`
			con.query(update_query);
		});

		message.reply(`You replied to the reply with: ${args[0]}`);

	}
}
