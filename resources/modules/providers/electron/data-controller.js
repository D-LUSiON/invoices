const {
    ipcMain
} = require('electron');

class ProvidersController {
    constructor() {
        console.log(`Hello from ${this.constructor.name}!`);
        this.getProvidersListener();
    }

    getProvidersListener() {
        ipcMain.on('providers:all', (event, args) => {
            console.log(`requested all providers...`);

            event.sender.send('providers:all:response', []);
        });
    }
}

module.exports = ProvidersController;
