const { ActivityType, EmbedBuilder, Colors } = require('discord.js');
const log = require('../../../utils/log.js');

async function execute(client2, client) {
    // Set activity and log ready state
    if (client && client.user && typeof client.user.setActivity === 'function') {
        client.user.setActivity('Students', { type: ActivityType.Watching });
    }

    log(`Connecting as ${client?.user?.tag ?? 'unknown'}`, 'info', true);

    const embed = new EmbedBuilder()
        .setTitle(`[LOGIN SUCCESSFUL]`)
        .setColor(Colors.Green)
        .setThumbnail(client?.user?.displayAvatarURL?.() ?? '')
        .setTimestamp();

    if (client && client.channels && client.channels.cache) {
        const ch = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
        if (ch && ch.send) ch.send({ embeds: [embed] });
    }
}

module.exports = execute;