const {
    ipcMain
} = require('electron');

class SendingController {
    constructor(db_instance) {
        console.log(`Hello from ${this.constructor.name}!`);
        this.database = db_instance;

        this.startListeners();
    }

    startListeners() {
        ipcMain.on('sending:all', (event, args) => {
            event.sender.send('sending:all:response', []);
        });
    }
}

module.exports = SendingController;
