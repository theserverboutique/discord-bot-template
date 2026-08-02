const {
    SlashCommandBuilder,
    MessageFlags
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Checks the bot's current response time."),

    async execute(interaction) {
        const initialReply = await interaction.reply({
            content: "Calculating response time...",
            flags: MessageFlags.Ephemeral,
            withResponse: true
        });

        const websocketLatency = Math.round(
            interaction.client.ws.ping
        );

        const responseLatency = Math.max(
            0,
            initialReply.resource.message.createdTimestamp -
                interaction.createdTimestamp
        );

        await interaction.editReply({
            content: [
                "🏓 **Pong!**",
                `Bot response: **${responseLatency}ms**`,
                `Discord gateway: **${websocketLatency}ms**`
            ].join("\n")
        });
    }
};