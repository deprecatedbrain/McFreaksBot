const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('get bot ping'),
	async execute(interaction) {
		const returnEmbed = new EmbedBuilder()
			.setColor([212, 224, 49])
			.setTitle('pong :3')
			.addFields({ name: 'Latency', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true })
		interaction.reply({ embeds: [returnEmbed], ephemeral: true });
	},
};