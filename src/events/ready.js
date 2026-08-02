const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,

    execute(client) {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🌸 The Server Boutique Bot Template");
        console.log(`✓ Logged in as ${client.user.tag}`);
        console.log(`✓ Serving ${client.guilds.cache.size} server(s)`);
        console.log(`✓ Loaded ${client.commands.size} command(s)`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }
};