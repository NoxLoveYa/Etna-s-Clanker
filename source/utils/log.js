const colors = {
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

const colorsByType = {
    info: colors.green,
    warning: colors.yellow,
    error: colors.red,
    debug: colors.blue,
    event: colors.cyan,
    hook: colors.magenta
};

const headersByType = {
    info: '[INFO]',
    warning: '[WARNING]',
    error: '[ERROR]',
    debug: '[DEBUG]',
    event: '[EVENT]',
    hook: '[HOOK]'
};

function log(message, messageType = 'info', includeTimestamp = true) {
    const color = colorsByType[messageType] || colors.reset;
    const header = headersByType[messageType] || '[LOG]';
    const timestamp = includeTimestamp ? `${new Date().toLocaleTimeString()} ` : '';
    console.log(`${color}${header}${colors.reset} ${timestamp}${message}`);
}

module.exports = log;