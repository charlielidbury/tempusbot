exports.run = (client, message, args) => {
	if ((args[0] != "accept") && (args[0] != "decline")) {
		message.reply("Must specify 'accept' or 'decline'");
	} else {
		// imports
		const config = require("../config.json");
		const mysql = require("mysql");
		var con = mysql.createConnection(config.sql);

		// finds the guildmember who sent the message
		var server = client.guilds.get(config.server);
		var nickname = server.members.get(message.author.id).nickname;

		con.connect(err => {
			if (err) throw err;

			// finds the session(s)
			if (args[0] == 'accept')
				con.query(`SELECT DATE_FORMAT(session, "%Y-%m-%d") as date FROM invite WHERE employee = "${nickname}" AND received IS NULL`, (err, results, fields) => {
					if (err) throw err;
					results.forEach(row => {
						if (!server.channels.exists("name", row.date))
						{ // create new channel if it doesn't exist
							console.log("Creating channel...");
							server.createChannel(row.date)
								.then(channel => {
									console.log("Channel Created");
									// stops everyone from being able to see it
									channel.overwritePermissions(server.defaultRole, { "READ_MESSAGES": false });
									// allows you to see it
									channel.overwritePermissions(message.author, { "READ_MESSAGES": true });
									// moves the channel into the TEMPUS category
									channel.setParent(server.channels.find(ch => ch.name == config.session_category));
								})
								.catch(console.error);
						} else {
							console.log("Channel already exists");
							// allows you to see it
							server.channels.find("name", row.date).overwritePermissions(message.author, { "READ_MESSAGES": true });
						}
					});
				});

			// sets invite to accepted
			con.query(`UPDATE invite SET received = NOW(), accepted = ${args[0] == 'accept'} WHERE employee = "${nickname}" AND received IS NULL`);
		});
	}
}
