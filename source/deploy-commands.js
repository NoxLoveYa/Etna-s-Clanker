require('dotenv').config()

// Use the official REST client and API types for compatibility with the latest Discord API
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Construct and prepare an instance of the REST module
if (!clientId || !token) {
	console.error('Missing CLIENT_ID or TOKEN in environment. Aborting command deploy.');
	process.exit(1);
}

// Construct and prepare an instance of the REST module (use API v10)
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// Decide whether to deploy to a single guild (faster, for testing) or globally
		let data;
		if (guildId) {
			// Deploy to a guild (instant)
			data = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			);
			console.log(`Successfully reloaded ${data.length} guild (/) commands for guild ${guildId}.`);
		} else {
			// Deploy globally (may take up to an hour to update)
			data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);
			console.log(`Successfully reloaded ${data.length} global (/) commands.`);
		}
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
