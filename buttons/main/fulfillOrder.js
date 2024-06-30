const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'fulfillorder',

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        console.log("hello")
        const oldEmbed = interaction.message.embeds[0];
        const fields = oldEmbed.fields;
        let orderNumber;

        for (let item of fields) {
            if (item.name === "Order ID") {
                orderNumber = parseInt(item.value);
                console.log(14124)
            }
            if (item.name === "Status") {
                item.value = 'Completed';
                console.log("overee")
            }
        }

        const returnEmbed = new EmbedBuilder()
            .setColor([61, 224, 49])
            .setTitle(oldEmbed.title)
            .addFields(fields);

        await interaction.message.edit({ content: interaction.message.content, embeds: [returnEmbed], components: [] });
        await interaction.editReply({ content: "Order fulfilled.", ephemeral: true });

        // Update the log
        const logPath = path.join(__dirname, '../../orderLogs.json');
        const orderLogs = JSON.parse(fs.readFileSync(logPath, 'utf8'));

        for (let order of orderLogs) {
            if (order.orderNumber === orderNumber) {
                order.status = 'Completed';
                break;
            }
        }

        fs.writeFileSync(logPath, JSON.stringify(orderLogs, null, 2), 'utf8');
    }
}
