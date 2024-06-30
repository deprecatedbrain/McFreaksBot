const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'denyorder',

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Danger);
        
        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Nevermind')
            .setStyle(ButtonStyle.Success);
        
        const row = new ActionRowBuilder()
            .addComponents(confirm, cancel);

        await interaction.editReply({ content: `Are you sure you want to deny this order?`, components: [row] });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await interaction.channel.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if (confirmation.customId === 'confirm') {
                const fields = interaction.message.embeds[0].fields;

                let orderNumber;

                for (let item of fields) {
                    if (item.name === "Order ID") {
                        console.log(parseInt(item.value));
                        orderNumber = parseInt(item.value);
                    }
                    if (item.name === "Status") {
                        item.value = 'Denied';
                    }
                }

                const returnEmbed = new EmbedBuilder()
                    .setColor([224, 49, 49])
                    .setTitle('Online Order #0')
                    .addFields(fields)
                    .setTimestamp();

                await interaction.message.edit({ content: interaction.message.content, embeds: [returnEmbed], components: [] });
                await confirmation.update({ content: 'Order Denied', components: [] });

                // Update the log
                const logPath = path.join(__dirname, '../../orderLogs.json');
                const orderLogs = JSON.parse(fs.readFileSync(logPath, 'utf8'));

                for (let order of orderLogs) {
                    if (order.orderNumber === orderNumber) {
                        order.assignee = interaction.user.id;
                        order.status = 'Denied';
                        break;
                    }
                }

                fs.writeFileSync(logPath, JSON.stringify(orderLogs, null, 2), 'utf8');
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({ content: 'Cancelled', components: [] });
            }
        } catch (e) {
            console.log(e);
            await interaction.editReply({ content: 'Interaction timed out', components: [] });
        }

        // Ensure this only runs if the above code did not already respond to the interaction
        if (!interaction.replied) {
            await interaction.editReply({ content: "Order fulfilled.", ephemeral: true });
        }
    }
}
