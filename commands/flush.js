exports.run = (client, message, args) => {
	if (message.member && !message.member.hasPermission("checkAdmin")) return; // only admins can use this function

	// connect to the database
	const mysql  = require("mysql");
	const config = require("../config.json");
	var   con    = mysql.createConnection(config.sql);

	var mbx_server  = client.guilds.get(config.server);
	var tempus_cat  = mbx_server.channels.get(config.channel);
	var mbx_members = mbx_server.members;
	var member_map  = {}; // { member_map[member.nickname]:member for member in mbx_members }
	mbx_members.forEach(member => { member_map[member.nickname] = member });

	function log(text) { console.log(`\t[${message.content || "?"}]: ${text}`); }

	con.connect((err) => {
		if (err) throw err;

		// SENDS UNSENT INVITES
		tempus.sendAllInvites(client, con);

		// CREATES CHANNELS FOR UNFINISHED SESSIONS
		con.query("SELECT DATE_FORMAT(session.date, '%Y-%m-%d') AS date, shift.date IS NOT NULL AS finished FROM session LEFT JOIN shift ON shift.date = session.date GROUP BY session.date", (err, result, field) => {

			var unfinished = result.filter(row => !row.finished).map(row => row.date);

			// deletes all channels that aren't supposed to be there
			mbx_server.channels.forEach( channel => { if (!unfinished.includes(channel.name) && channel.parentID == config.channel)
				{ log(`Deleting: ${channel.name}`); channel.delete(); } });

			// makes all the channels that are supposed to be there
			unfinished.forEach(date => {
				var channel = mbx_server.channels.find("name", date)
				if (channel) {
					log(`Channel ${channel.name} already exists, populating.`);
					tempus.populateChannel(client, mysql_con, date);
				} else tempus.createChannel(client, date)
					.then(tempus.populateChannel(client, mysql_con, date));
			});

		});

	});
}
