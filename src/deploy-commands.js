require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");

const {
    REST,
    Routes
} = require("discord.js");

/*
|--------------------------------------------------------------------------
| Validate Environment Variables
|--------------------------------------------------------------------------
*/

const requiredEnvironmentVariables = [
    "DISCORD_TOKEN",
    "CLIENT_ID",
    "GUILD_ID"
];

const missingEnvironmentVariables =
    requiredEnvironmentVariables.filter(
        (variable) => !process.env[variable]
    );

if (missingEnvironmentVariables.length > 0) {
    console.error(
        "✗ Missing required environment variables:"
    );

    for (const variable of missingEnvironmentVariables) {
        console.error(`  - ${variable}`);
    }

    process.exit(1);
}

/*
|--------------------------------------------------------------------------
| Load Command Data
|--------------------------------------------------------------------------
*/

const commands = [];

const commandsPath = path.join(
    __dirname,
    "commands"
);

const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(
        commandsPath,
        file
    );

    const command = require(filePath);

    if (
        !command.data ||
        typeof command.data.toJSON !== "function"
    ) {
        console.warn(
            `⚠ Skipped ${file}: missing valid command data.`
        );

        continue;
    }

    commands.push(command.data.toJSON());
}

/*
|--------------------------------------------------------------------------
| Deploy Commands
|--------------------------------------------------------------------------
*/

const rest = new REST({
    version: "10"
}).setToken(process.env.DISCORD_TOKEN);

async function deployCommands() {
    try {
        console.log(
            `🌸 Deploying ${commands.length} guild command(s)...`
        );

        const deployedCommands = await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            {
                body: commands
            }
        );

        console.log(
            `✓ Successfully deployed ${deployedCommands.length} command(s).`
        );
    } catch (error) {
        console.error(
            "✗ Failed to deploy application commands:",
            error
        );

        process.exitCode = 1;
    }
}

deployCommands();