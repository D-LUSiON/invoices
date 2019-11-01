/******************************************
 * This is the main entry point of Electron
 *
 * You can modify it to fit your needs
 ******************************************/

const env = require('./environment.js');
const electron = require('electron');
const {
    app,
    dialog,
} = electron;

const DataStore = require('./dataStore');

const path = require('path');

if (!env.production) {
    app.setName(`${app.getName()} (development mode)`);
    app.setPath('userData', `${app.getPath('userData')}-dev`);
}

const MainWindow = require('./mainWindow');
let mainWindow;
let storage;

// Create window on electron intialization
app.on('ready', () => {
    mainWindow = new MainWindow();
    mainWindow.createWindow();
    storage = new DataStore(app);

    // const sqlite3 = require('sqlite3');
    // const db = new sqlite3.Database(':memory:');

    // db.serialize(() => {
    //     db.each("SELECT 1+1 AS result", (err, row) => {
    //         dialog.showMessageBox({
    //             title: 'SQLite is working!',
    //             message: `result: ${JSON.stringify(row)}`
    //         });
    //     });
    // });

    // const Database = require('better-sqlite3');
    // const db = new Database(path.join(app.getPath('userData'), 'database.sqlite'), {
    //     verbose: console.log
    // });

    // const row = db.prepare('SELECT 1+1 AS result').get();
    // console.log('db response:', row);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // macOS specific close process
    if (mainWindow.window === null) {
        mainWindow.createWindow();
    }
});
