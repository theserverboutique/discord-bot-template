require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");

const {
    Client,
    Collection,
    GatewayIntentBits,
    Events
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.commands = new Collection();

/*
|--------------------------------------------------------------------------
| Load Commands
|--------------------------------------------------------------------------
*/

const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
            console.log(`✓ Loaded command: ${command.data.name}`);
        } else {
            console.warn(
                `⚠ ${file} is missing "data" or "execute".`
            );
        }
    }
}

/*
|--------------------------------------------------------------------------
| Load Events
|--------------------------------------------------------------------------
*/

const eventsPath = path.join(__dirname, "events");

if (fs.existsSync(eventsPath)) {
    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        if (event.once) {
            client.once(event.name, (...args) =>
                event.execute(...args, client)
            );
        } else {
            client.on(event.name, (...args) =>
                event.execute(...args, client)
            );
        }

        console.log(`✓ Loaded event: ${event.name}`);
    }
}

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

client.login(process.env.DISCORD_TOKEN);