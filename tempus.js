const config = require("./config.json");
const mysql = require("mysql");
const mysql_con = mysql.createConnection(config.sql);

exports.test = (client, one, two) => {
	client.guilds.forEach(guild => console.log(guild.name));

	console.log(one);
	console.log(two);
}

// INVITE MANAGEMENT

exports.sendAllInvites = (client) => {
	/* Sends all unsent invites to invitees

	client <= Discord.js client object
	*/

	// gets all unsent invites
	const query = `SELECT employee, DATE_FORMAT(session, '%Y-%m-%d') AS session FROM invite WHERE sent IS NULL`;
	mysql_con.query(query, (err, result) => {
		if (err) console.error(`Error while sending invites: ${err}`);
		// sends messages
		result.forEach(row => exports.sendInvite(client, mysql_con, row.session, row.employee));
	});
}

exports.sendInvite = (client, date, user, invite_message) => {
	/* Invites [user] to session on [date]

	client <= Discord.js client object
	date <= "2018-02-25"; date as string (YYYY-MM-DD)
	user <= "Charlie"; tempus username & discord nickname
	*/

	// find user
	const mbx_server = client.guilds.get(config.server);
	const target_user = mbx_server.members.find("displayName", user);

	// send the message
	console.log(`Sent invite for ${date} to ${user}`);
	target_user.send(invite_message);

	// mark the message as sent on the database
	const query = `UPDATE invite SET sent = NOW() WHERE session = "${date}" AND employee = "${user}"`;
	mysql_con.query(query, err => err && console.error(`Error setting invites as sent: ${err}`));
};

exports.replyToInvites = (client, user, reply) => {
	/* Sets all unanswered from [user] to [reply]

	client <= Discord.js client object
	user <= "Charlie"; tempus username & discord nickname
	reply <= true; true for accepted false for decline
	*/

	const query = `UPDATE invite SET received = NOW(), accepted = ${reply ? 1 : 0} WHERE employee = "${user}"`;
	mysql_con.query(query, err => err && console.error(`Error while ${user} replied to invites with ${reply}: ${err}`));
};

// CHANNEL MANAGEMENT

exports.createChannel = (client, date) => {
	/* Creates a channel for session on [date]

	client <= Discord.js client object
	date <= "2018-02-25"; date as string (YYYY-MM-DD)
	returns => Channel object made
	*/

	const mbx_server = client.guilds.get(config.server);
	const tempus_cat = mbx_server.channels.get(config.channel);
	// creates channel that @everyone can't read
	return mbx_server.createChannel(date, "text", [ {"id":mbx_server.defaultRole,"deny":1024} ])
		.then(channel => { console.log(`Channel created: ${date}`); channel.setParent(tempus_cat); })
		.catch(err => console.error(`Failed creating channel ${date}: ${err}`) );
};

exports.deleteChannel = (client, date) => {
	/* Deletes channel for session on [date]

	client <= Discord.js client object
	date <= "2018-02-25"; date as string (YYYY-MM-DD)
	returns => Channel object deleted
	*/

	const mbx_server = client.guilds.get(config.server);
	// deletes the channel
	return mbx_server.channels.find("name", date).delete()
		.then(channel => console.log(`Channel ${date} deleted`) )
		.catch(err => console.error(`Error while deleting channel: ${date}: ${err}`));
};

// PERMISSION MANAGEMENT

exports.populateChannel = (client, date) => {
	// ADDS INVITED PEOPLE TO CHANNEL
	const query = `SELECT employee FROM invite WHERE invite.session = "${channel.name}" AND accepted`;
	mysql_con.query(query, (err, result, field) => {
		if (err) console.error(`Error populating ${date}: ${err}`);
		result.forEach(row => tempus.addUser(client, date, row.employee));
	});
}

exports.addUser = (client, date, user) => {
	/* Adds [user] to channel for session on [date]

	date <= "2018-02-25"; date as string (YYYY-MM-DD)
	user <= "Charlie"; tempus username & discord nickname
	*/

	// finds the channel
	const mbx_server = client.guilds.get(config.server);
	const target_channel = mbx_server.channels.find("name", date);
	// finds the user
	const target_user = mbx_server.members.find("displayName", user);
	// adds the permission override
	target_channel.overwritePermissions(target_user, { "READ_MESSAGES": true });
};

exports.removeUser = (client, date, user) => { // WIP
	/* Removes [user] from channel for session on [date]

	date <= "2018-02-25"; date as string (YYYY-MM-DD)
	user <= "Charlie"; tempus username & discord nickname
	*/

	// finds the channel
	const mbx_server = client.guilds.get(config.server);
	const target_channel = mbx_server.channels.find("name", date);
	// finds the user ID
	const target_user = mbx_server.members.find("displayName", user);
	// removes the permission overwrite
	target_channel.overwritePermissions(target_user, false);
};
