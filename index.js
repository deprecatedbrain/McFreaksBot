// Load up the bot, commands, and events

const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();

const fs = require('fs');  // Corrected import for fs module
const path = require('path');  // Corrected import for path module

const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
client.cooldowns = new Collection();
client.buttons = new Collection();

// Get commands, events, and buttons
const commandsFolderPath = path.join(__dirname, 'commands');
const commandFolder = fs.readdirSync(commandsFolderPath);

const buttonsFolderPath = path.join(__dirname, 'buttons');
const buttonFolder = fs.readdirSync(buttonsFolderPath);

const eventsFolderPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsFolderPath).filter(file => file.endsWith('.js'));

// Load command files
for (const folder of commandFolder) {
    const commandsPath = path.join(commandsFolderPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`Warning: command at ${filePath} is missing data or execute property`);
        }
    }
}

// Load event files
for (const file of eventFiles) {
    const filePath = path.join(eventsFolderPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Load button files
for (const folder of buttonFolder) {
    const buttonsPath = path.join(buttonsFolderPath, folder);
    const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

    for (const file of buttonFiles) {
        const filePath = path.join(buttonsPath, file);
        const button = require(filePath);

        if ('name' in button && 'execute' in button) {
            client.buttons.set(button.name, button);
        } else {
            console.log(`Warning: button at ${filePath} is missing name or execute property`);
        }
    }
}

// Login
client.login(token);
