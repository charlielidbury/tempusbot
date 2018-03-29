exports.run = (client, message, args) => {
	// imports
	const config = require("../config.json");
	const mysql = require("mysql");

	// finds the guildmember who sent the message
	const con = mysql.createConnection(config.sql);
	const server = client.guilds.get(config.server);
	const user = server.members.get(message.author.id).displayName;

	con.connect(err => {
		if (err) throw err;

		const invite_query = `SELECT accepted FROM invite WHERE session = CURRENT_DATE() AND employee = '${user}'`;
		con.query(invite_query, (err, result) => {
			// CHECKS IF USER HAS AN ACCEPTED INVITE
			if (err) throw err;

			if (result[0].accepted) {
				// Displays current time
				const current_time_query = `SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(COALESCE(clock_off, CURRENT_TIME())) - TIME_TO_SEC(clock_on))) AS total FROM clock WHERE session = CURRENT_DATE() AND employee = '${user}'`;
				con.query(current_time_query, (err, result) => {
					if (err) throw err;

					if (result[0].total == null) {
						message.reply("No time logged so far.");
					} else {
						message.reply(`${result[0].total} so far.`);
					}
				});

				// Actually logs on or off
				const status_query = `SELECT IF((SELECT session FROM clock WHERE session = CURRENT_DATE() AND employee = '${user}' AND clock_off IS NULL), "on", "off") AS status`;
				if (args[0])
					con.query(status_query, (err, result) => {
						if (err) throw err;

						console.log(`Status: ${result[0].status}, args: ${args[0]}`);
						if (result[0].status == args[0]) {
							message.reply(`Clock is already ${result[0].status}`)
						} else {
							message.reply(`Clocking ${args[0]}`);
							con.query(`CALL toggleClock('${user}')`);
						}
					});
				else
					message.reply("Usage: '!clock on' to start the clock, '!clock off' to stop it and '!clock' to see current time.");
			}
		});
	});
}

/*

SELECT IF((SELECT session FROM clock WHERE session = CURRENT_DATE() AND employee = 'Charlie' AND clock_off IS NULL), "on", "off") AS status
*/
