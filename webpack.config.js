const devConsole = require('./cartridges/rvw_dev_console/webpack.config');
const devTools = require('./cartridges/rvw_dev_tools/webpack.config');

// Load Each Cartridge's WebPack Config
module.exports = [
    devConsole,
    devTools
];
