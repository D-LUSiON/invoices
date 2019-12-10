/******************************************
 * This is the main entry point of Electron
 *
 * You can modify it to fit your needs
 ******************************************/

const env = require('./environment.js');
const electron = require('electron');
const {
    app,
} = electron;

if (!env.production) {
    app.name = `${app.name} (development mode)`;
    app.setPath('userData', `${app.getPath('userData')}-dev`);
}

const app_user_data_path = app.getPath('userData');

const MainWindow = require('./lib/mainWindow');
const ExtensionsManager = require('./lib/extensionsManager');
let mainWindow;
let extensionsManager;

const single_instance = app.requestSingleInstanceLock();

if (!single_instance && env.single_instance) {
    app.quit();
    return;
} else {
    if (env.single_instance) {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our window.
            if (mainWindow.window) {
                if (mainWindow.window.isMinimized())
                    mainWindow.window.restore();
                mainWindow.window.focus();
            }
        });
    }

    // Create window on electron intialization
    app.on('ready', () => {
        extensionsManager = new ExtensionsManager(app_user_data_path);
        mainWindow = new MainWindow(app);
        mainWindow.createWindow();
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
}
