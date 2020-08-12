const package_json = require('./package.json');

const environment = {
    name: package_json.name,
    description: package_json.description,
    production: true,
    single_instance: true,
    html_src: 'app',
    background_color: '#ffffff',
    resizable: true,
    maximizable: true,
    frame: false,
    titlebar_style: 'hidden',
    default_width: 1200,
    default_height: 675,
    min_width: 1200,
    min_height: 675,
    fixed_width: null,
    fixed_height: null,
    allow_devtools: true
};

module.exports = environment;
