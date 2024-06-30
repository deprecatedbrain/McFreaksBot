const { Events, Collection } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction) {
        // chat command handler
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`Couldn't find ${interaction.commandName}`);
                return;
            }

            const cooldowns = interaction.client.cooldowns;

            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 3;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    return interaction.reply({ content: `Slow down, try again <t:${expiredTimestamp}:R>`, ephemeral: true });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                await command.execute(interaction);
            } catch (err) {
                console.error(err);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'An error occurred while executing the command.', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
                }
            }
        }

        // button handler
        if (interaction.isButton()) {
            const button = interaction.client.buttons.get(interaction.customId);

            if (!button) {
                return;
            }

            try {
                await button.execute(interaction);
            } catch (err) {
                console.error(err);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'An error occurred while executing the button action.', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'An error occurred while executing the button action.', ephemeral: true });
                }
            }
        }
    },
};