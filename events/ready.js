const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,

	execute(client) {
		console.log(`Client logged in | ${client.user.tag}`);
        client.user.setActivity('void hub condos')
	},
};