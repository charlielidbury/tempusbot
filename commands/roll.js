exports.run = (client, message, args) => {
	var roll = Math.floor(Math.random() * 6) + 1;
	message.reply("You rolled: " + roll);
}
