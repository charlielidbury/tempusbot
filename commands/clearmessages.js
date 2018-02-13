exports.run = (client, message, args) => {
	if (!message.member.hasPermission("checkAdmin")) return; // only admins can use this function

	client.guilds.forEach( Guild => {
		Guild.members.forEach( GuildMember => {
			console.log(GuildMember.user);
		});
	});

}
