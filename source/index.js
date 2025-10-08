require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");

const {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	Partials,
	ActivityType,
	EmbedBuilder,
	Colors,
} = require("discord.js");
const { CLIENT_RENEG_LIMIT } = require("node:tls");
const { channel } = require("node:diagnostics_channel");

const log = require("./utils/log.js");

// Create a new client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds | GatewayIntentBits.GuildVoiceStates],
	partials: [
		Partials.Message,
		Partials.Channel,
		Partials.Reaction,
		Partials.GuildMember,
	],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	} else {
		log(`The command at ${filePath} is missing a required "data" or "execute" property.`, 'warning', true);
	}
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const events = require(filePath);
	for (const event of events) {
		if ("name" in event && "execute" in event) {
			if (event.once) {
				client.once(event.name, (...args) => event.execute(client, ...args));
			} else {
				client.on(event.name, (...args) => event.execute(client, ...args));
			}
			log(`${event.name} event loaded.`, 'event', true);
		} else {
			log(`The event at ${filePath} is missing a required "name" or "execute" property.`, 'warning', true);
		}
	}
}
log(`Bot is starting...`, 'info', true);

client.login(process.env.TOKEN);
