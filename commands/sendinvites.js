exports.run = (client, message, args) => {
	if (!message.member.hasPermission("checkAdmin")) return; // only admins can use this function

	// connect to the database
	const mysql = require("mysql");
	const config = require("../config.json");
	var con = mysql.createConnection(config.sql);

	con.connect((err) => {
		if (err) throw err;

		// get list of employees that have invites unsent
		var invites = [];
		con.query("SELECT `employee`, `session` FROM `invite` WHERE `sent` IS NULL", (err, result, fields) => {
			var mbx_members = client.guilds.get(config.server).members;
			var member_map = {};
			mbx_members.forEach(member => { member_map[member.nickname] = member });
			// Sends the messages out
			result.forEach(row => member_map[row.employee].user.send(
`You have been invited into session: ${row.session.getDate()}/${row.session.getMonth()+1}/${row.session.getFullYear()}. \
Reply with '!invite accept' to accept the invite or '!invite decline' to decline. \
Go to ${config.inboxurl} to see all invites.`));
			// Marks all as sent
			con.query("UPDATE `invite` SET `sent` = NOW() WHERE `sent` IS NULL");
		});
	});
}
