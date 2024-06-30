const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const menuItems = [

];

module.exports = {
    cooldown: 5,

	data: new SlashCommandBuilder()
		.setName('menu')
		.setDescription('get the freak menu'),
	
    async execute(interaction) {
        const returnEmbed = new EmbedBuilder()
            .setColor([212, 224, 49])
            .setTitle('McFreaks Menu')
            .setThumbnail('https://cdn.discordapp.com/attachments/1256868245835747340/1257048304550936686/freakdonalds.png?ex=6682fcf6&is=6681ab76&hm=0ed4ad9e9e68862b5184749cec6d38cc9f96fe3bd2d3deb487dc0ffbd057e835&')
            .addFields(
                { name: 'Food Items', value: `Freaky Meal\nFreak Mac\Bent Fries (w/ sauce variety *Freak Sauce*)\nFish o' Filet\nFreak Pounde\nCrispy Onion BBC\nMcMilf`, inline: true },
                { name: 'Drinks', value: 'Diet Coke\nDiet Cock\n"Milk"/squirt Shake\nBreast Milk', inline: true},
                { name: 'Deserts', value: 'Freak Cream\nRocky Hoes\nMcBreastFlurry', inline: true}
            )
            .setTimestamp()
            .setFooter({text:'© McFreaks 2024'})

        interaction.reply({ embeds: [returnEmbed] });
    },
};
