const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'takeorder',

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const oldEmbed = interaction.message.embeds[0];
        const fields = oldEmbed.fields;
        const components = interaction.message.components[0].components;
        let orderNumber;

        for (let item of fields) {
            if (item.name === "Order ID") {
                orderNumber = parseInt(item.value);
            }
            if (item.name === "Asignee") {
                if (item.value === "None") {
                    item.value = `<@${interaction.user.id}>`;
                } else {
                    await interaction.editReply("This order has already been assigned!");
                    return;
                }
            } else if (item.name === "Status") {
                item.value = 'In Progress';
            }
        }

        const returnEmbed = new EmbedBuilder()
            .setColor([212, 224, 49])
            .setTitle(oldEmbed.title)
            .addFields(fields);

        const updatedComponents = components
            .filter(component => component.customId !== 'takeorder')
            .map(component => new ButtonBuilder()
                .setCustomId(component.customId)
                .setLabel(component.label)
                .setStyle(component.style)
            );

        const actionRow = new ActionRowBuilder().addComponents(updatedComponents);

        await interaction.message.edit({ content: interaction.message.content, embeds: [returnEmbed], components: [actionRow] });
        await interaction.editReply({ content: "You have been assigned to this order.", ephemeral: true });

        const logPath = path.join(__dirname, '../../orderLogs.json');
        const orderLogs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
        
        for (let order of orderLogs) {
            if (order.orderNumber === orderNumber) {
                order.assignee = interaction.user.name;
                order.status = 'In Progress';
                break;
            }
        }

        fs.writeFileSync(logPath, JSON.stringify(orderLogs, null, 2), 'utf8');
    }
}
