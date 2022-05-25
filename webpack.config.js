const devConsole = require('./cartridges/sfcc_dev_console/webpack.config');
const devTools = require('./cartridges/sfcc_dev_tools/webpack.config');

// Load Each Cartridge's WebPack Config
module.exports = [
    devConsole,
    devTools
];
