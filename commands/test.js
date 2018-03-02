exports.run = (client, message, args) => {
	if (!message.member.hasPermission("checkAdmin")) return; // only admins can use this function

	const mysql = require("mysql");
	const config = require("../config.json");

	var con = mysql.createConnection(config.sql);
	var mbx_server = client.guilds.get(config.server);
	var tempus_cat = mbx_server.channels.get(config.channel);
	var mbx_members = mbx_server.members;

	var member_map = {};
	mbx_members.forEach(member => { member_map[member.nickname] = member });

	con.connect((err) => {
		if (err) throw err;

		function populateChannel(channel) {
			// ADDS INVITED PEOPLE TO CHANNEL
			con.query(`SELECT employee FROM invite WHERE session = "${channel.name}" AND accepted`, (err, result, field) => {
				result.forEach(row => {
					console.log(`\t[${message.content}]: Employee found: ${row.employee}`);
					channel.overwritePermissions(member_map[row.employee], { "READ_MESSAGES": true });
				});
			});
		}

		populateChannel(tempus_cat.children.find("name", "2018-02-25"));

	});
}
