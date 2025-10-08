const { Events, ActivityType, EmbedBuilder, Colors } = require('discord.js');
const fs = require('fs');
const path = require('path');

const log = require('../utils/log.js');

const ready = {
	name: Events.ClientReady,
	once: true,
	async execute(client2, client) {
		// Load all hook files from source/events/hooks/ClientReady and execute them.
		const hooksDir = path.join(__dirname, 'hooks', 'ClientReady');

		if (!fs.existsSync(hooksDir)) return;

		const files = fs.readdirSync(hooksDir).filter(f => f.endsWith('.js') || f.endsWith('.cjs'));

		for (const file of files) {
			const fullPath = path.join(hooksDir, file);
			try {
				const hook = require(fullPath);

				// If the hook exports a function, call it. If it exports an object with execute, call that.
				if (typeof hook === 'function') {
					await hook(client2, client);
				} else if (hook && typeof hook.execute === 'function') {
					await hook.execute(client2, client);
				} else if (hook && typeof hook.default === 'function') {
					// Support transpiled/default exports
					await hook.default(client2, client);
				} else {
					log(`Hook ${file} in ClientReady did not export a callable (function/execute).`, 'warning', true);
				}
			} catch (err) {
				log(`Failed to run ClientReady hook ${file}: ${err}`, 'error', true);
			}
			log(`Executed ClientReady hook: ${file}`, 'debug', true);
		}
	},
};

module.exports = [ready];
