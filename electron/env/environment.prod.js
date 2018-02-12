const package_json = require('../package.json');

const environment = {
    name: package_json.name,
    description: package_json.description,
    production: true,
    port: 4201,
    resizable: false,
    frame: false,
    default_width: 800,
    default_height: 600,
};

module.exports = environment;
