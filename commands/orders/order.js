const { ActionRowBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

const pingId = '1257040264548057118';
const orderChannelId = '1257025761399934981';
const logFilePath = path.join(__dirname, '../../orderLogs.json');

module.exports = {
    cooldown: 90,

    data: new SlashCommandBuilder()
        .setName('order')
        .setDescription('order something from the freak menu (see /menu)')
        .addStringOption(option => 
            option.setName('items')
                .setDescription('your items to order')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        const items = interaction.options.getString('items');

        const takeOrderBtn = new ButtonBuilder()
            .setCustomId('takeorder')
            .setLabel('Take Order')
            .setStyle(ButtonStyle.Primary);

        const fulfillOrderBtn = new ButtonBuilder()
            .setCustomId('fulfillorder')
            .setLabel('Order Finished')
            .setStyle(ButtonStyle.Success);

        const denyOrderBtn = new ButtonBuilder()
            .setCustomId('denyorder')
            .setLabel('Deny Order')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(takeOrderBtn, fulfillOrderBtn, denyOrderBtn);

        const orderNumber = await getOrderNumber();

        const returnEmbed = new EmbedBuilder()
            .setColor([212, 224, 49])
            .setTitle(`Order #${orderNumber}`)
            .addFields(
				{ name: 'Order ID', value: `${orderNumber}`, inline: true },
                { name: 'Items', value: `${items}`, inline: true },
                { name: 'Status', value: 'Open', inline: true },
                { name: 'Orderer', value: `<@${interaction.user.id}>`, inline: true },
                { name: 'Asignee', value: `None`, inline: true }
            )
            .setTimestamp();

        const channel = interaction.client.channels.cache.get(orderChannelId);
        const message = channel.send({ content: `<@&${pingId}> order up`, embeds: [returnEmbed], components: [row] });

        await interaction.editReply({ content: `Submitted your order of \`${items}\`.\nYou will get a ping when your order is ready.` });

        logOrder({
            orderNumber,
            items,
            status: 'Open',
            orderer: interaction.user.id,
            assignee: 'None',
            timestamp: new Date().toISOString(),
			messageId: message.id
        });
    },
};

async function getOrderNumber() {
    let orders = [];
    if (fs.existsSync(logFilePath)) {
        const data = fs.readFileSync(logFilePath);
        orders = JSON.parse(data);
        if (!Array.isArray(orders)) {
            orders = [];
        }
    } else {
        fs.writeFileSync(logFilePath, JSON.stringify(orders, null, 2));
    }
    return orders.length + 1;
}

function logOrder(order) {
    let orders = [];
    if (fs.existsSync(logFilePath)) {
        const data = fs.readFileSync(logFilePath);
        orders = JSON.parse(data);
        if (!Array.isArray(orders)) {
            orders = [];
        }
    } else {
        fs.writeFileSync(logFilePath, JSON.stringify(orders, null, 2));
    }
    orders.push(order);
    fs.writeFileSync(logFilePath, JSON.stringify(orders, null, 2));
}
