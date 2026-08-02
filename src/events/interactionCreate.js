const { Events, MessageFlags } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const command = client.commands.get(
            interaction.commandName
        );

        if (!command) {
            console.warn(
                `⚠ No command found for /${interaction.commandName}`
            );

            return;
        }

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(
                `✗ Error while running /${interaction.commandName}:`,
                error
            );

            const reply = {
                content:
                    "Something went wrong while running this command.",
                flags: MessageFlags.Ephemeral
            };

            if (
                interaction.replied ||
                interaction.deferred
            ) {
                await interaction.followUp(reply);
            } else {
                await interaction.reply(reply);
            }
        }
    }
};