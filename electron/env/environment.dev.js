const package_json = require('../package.json');

const environment = {
    name: package_json.name,
    description: package_json.description,
    production: false,
    port: 4201,
    resizable: false,
    frame: false
};

module.exports = environment;
