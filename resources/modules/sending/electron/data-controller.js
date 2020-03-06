const {
    ipcMain
} = require('electron');

class SendingController {
    constructor() {
        console.log(`Hello from ${this.constructor.name}!`);
        this.getSendingListener();
    }

    getSendingListener() {
        ipcMain.on('sending:all', (event, args) => {
            console.log(`requested all sending...`);

            event.sender.send('sending:all:response', []);
        });
    }
}

module.exports = SendingController;
