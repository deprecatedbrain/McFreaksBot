const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    cooldown: 5,

	data: new SlashCommandBuilder()
		.setName('secretmenu')
		.setDescription('get the secret menu'),
	
    async execute(interaction) {
        await interaction.deferReply();
        const returnEmbed = new EmbedBuilder()
            .setColor([212, 224, 49])
            .setTitle('McFreaks *secret menu*')
            .setThumbnail('https://cdn.discordapp.com/attachments/1256868245835747340/1257048304550936686/freakdonalds.png?ex=6682fcf6&is=6681ab76&hm=0ed4ad9e9e68862b5184749cec6d38cc9f96fe3bd2d3deb487dc0ffbd057e835&')
            .addFields(
                { name: 'Secret Menu', value: 'McFuck\nMcBlowie\nMcHandJob\nMcFootJob\n***(LIMIT 1 PER CUSTOMER)***', inline: true}
            )
            .setTimestamp()
            .setFooter({text:'© McFreaks 2024'})

        await interaction.editReply({ embeds: [returnEmbed] });
    },
};
