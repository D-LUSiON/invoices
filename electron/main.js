const env = require('./environment.js');
const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    MenuItem,
    Tray,
    globalShortcut
} = require('electron');

const path = require('path');
const url = require('url');
const fs = require('fs');

const Datastore = require('nedb');

const windowStateKeeper = require('electron-window-state');

let mainWindow;

function createWindow() {
    // Initialize window state keeper
    let winState = windowStateKeeper({
        defaultWidth: env.default_width,
        defaultHeight: env.default_height
    });

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: winState.width,
        height: winState.height,
        minWidth: env.min_width,
        minHeight: env.min_height,
        x: winState.x,
        y: winState.y,
        resizable: env.resizable,
        frame: env.frame,
        show: false,
        backgroundColor: '#ffffff',
        icon: `file://${path.join(__dirname, '..', env.html_src, 'assets', 'app-icon-l.jpg')}`
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '..', env.html_src, 'index.html'),
        protocol: 'file:',
        slashes: true,
        webPreferences: {
            webSecurity: false
        }
    }));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // open the DevTools if not in production mode
    if (!env.production)
        mainWindow.webContents.openDevTools();

    // open the DevTools with Ctrl-F12
    globalShortcut.register('CommandOrControl+F12', () => {
        mainWindow.webContents.openDevTools();
    });

    // Event when the window is closed.
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Enable Electron reload if not in production mode
if (!env.production)
    require('electron-reload')(
        path.join(__dirname, '..'), {
            ignored: /node_modules|[\/\\]\./,
            electron: path.join(__dirname, '..', 'node_modules', 'electron', 'dist', 'electron.exe')
        }
    );

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // macOS specific close process
    if (win === null) {
        createWindow();
    }
});


// /******************************/
// /******* EXAMPLE EVENTS *******/
// /******************************/

// // Event handler for asynchronous incoming messages
// ipcMain.on('asynchronous-message', (event, arg) => {
//     console.log(arg);

//     // Event emitter for sending asynchronous messages
//     event.sender.send('asynchronous-reply', 'async pong')
// });

// // Event handler for synchronous incoming messages
// ipcMain.on('synchronous-message', (event, arg) => {
//     console.log(arg);

//     // Synchronous event emmision
//     event.returnValue = 'sync pong'
// });

// /***************************************/
// /******* FRONT-END COMMUNICATION *******/
// /***************************************/

const invoices_db = new Datastore({
    filename: path.join(app.getPath('userData'), 'invoices.db'),
    autoload: true
});
const providers_db = new Datastore({
    filename: path.join(app.getPath('userData'), 'providers.db'),
    autoload: true
});
const recipients_db = new Datastore({
    filename: path.join(app.getPath('userData'), 'recipients.db'),
    autoload: true
});
const settings_db = new Datastore({
    filename: path.join(app.getPath('userData'), 'settings.db'),
    autoload: true
});

const Excel = require('exceljs');

ipcMain.on('invoices:all', (event, filter) => {
    if (!filter) filter = {};
    invoices_db.find(filter, (err, invoices) => {
        if (err)
            console.log(err);
        event.sender.send('invoices:all:response', invoices);
    });
});

ipcMain.on('invoice:get', (event, id) => {
    invoices_db.find({
        _id: id
    }, (err, invoice) => {
        if (err)
            console.log(err);
        event.sender.send('invoice:get:response', invoice);
    });
});

ipcMain.on('invoice:save', (event, invoice) => {
    _saveRecipient(invoice, (updated_invoice) => {
        _saveProvider(updated_invoice, (upd_invoice) => {
            let new_invoice = JSON.parse(JSON.stringify(upd_invoice));
            delete new_invoice._id;

            if (upd_invoice._id) {
                invoices_db.update({
                    _id: upd_invoice._id
                }, new_invoice, {}, (err, rows_updated) => {
                    event.sender.send('invoice:save:response', upd_invoice);
                });
            } else {
                invoices_db.insert(new_invoice, (err, invoice_new) => {
                    event.sender.send('invoice:save:response', invoice_new);
                });
            }
        });
    });
});

function _saveProvider(invoice, callback) {
    if (invoice.provider) {
        const new_provider = JSON.parse(JSON.stringify(invoice.provider));
        delete new_provider._id;

        if (invoice.provider._id) {
            providers_db.update({
                _id: invoice.provider._id
            }, new_provider, {}, (err, rows_updated) => {
                callback.call(null, invoice);
            });
        } else {
            providers_db.insert(new_provider, (err, provider_new) => {
                invoice.provider = JSON.parse(JSON.stringify(provider_new));
                callback.call(null, invoice);
            });
        }
    }
}

function _saveRecipient(invoice, callback) {
    if (invoice.recipient) {
        const new_recipient = JSON.parse(JSON.stringify(invoice.recipient));
        delete new_recipient._id;

        if (invoice.recipient._id) {
            recipients_db.update({
                _id: invoice.recipient._id
            }, new_recipient, {}, (err, rows_updated) => {
                callback.call(null, invoice);
            });
        } else {
            recipients_db.insert(new_recipient, (err, recipient_new) => {
                invoice.recipient = JSON.parse(JSON.stringify(recipient_new));
                callback.call(null, invoice);
            });
        }
    }
}

ipcMain.on('invoice:remove', (event, invoice) => {
    if (invoice._id) {
        invoices_db.remove({
            _id: invoice._id
        }, (err, deleted_rows) => {
            if (deleted_rows > 0)
                event.sender.send('invoice:remove:response', [invoice]);
            else
                event.sender.send('invoice:remove:response', []);
        });
    } else {
        event.sender.send('invoice:remove:response', []);
    }
});

ipcMain.on('invoices:send', (event, send_data) => {
    _getEmailSettings(email_setttings => {
        const send = require('gmail-send')({
            user: email_setttings.sender[0].value.email,
            pass: email_setttings.sender[0].value.password,
            to: email_setttings.receiver[0].value.email
        });
        const workbook = new Excel.Workbook();
        workbook.creator = email_setttings.sender[0].value.email
        workbook.created = new Date();

        const sheet = workbook.addWorksheet('Фактури', {
            pageSetup: {
                paperSize: 9,
                orientation: 'landscape'
            }
        });
        const worksheet = workbook.getWorksheet(1);

        worksheet.columns = [
            { header: 'Номер на фактура', key: 'number', width: 20 },
            { header: 'Издадена на', key: 'issue_date', width: 15 },
            { header: 'Данъчна основа', key: 'total_sum', width: 20 },
            { header: 'ДДС 20%', key: 'total_vat', width: 10 },
            { header: 'Общо', key: 'total_total', width: 10 },
            { header: 'Тип', key: 'type', width: 10 },
            { header: 'Бележки', key: 'notes', width: 20 },
            { header: 'Доставчик', key: 'provider', width: 30 },
            { header: 'Доставчик - МОЛ', key: 'acc_person', width: 20 },
            { header: 'Доставчик - Адрес', key: 'address', width: 30 },
            { header: 'Доставчик - ДДС номер', key: 'vat', width: 30 },
            { header: 'Доставчик - ИН/ЕГН', key: 'vat2', width: 30 },
        ];

        const worksheet_data = send_data.invoices.map(invoice => {
            return {
                number: invoice.number,
                issue_date: invoice.issue_date,
                total_sum: invoice.total_sum,
                total_vat: invoice.total_vat,
                total_total: invoice.total_total,
                type: invoice.type,
                notes: invoice.notes,
                provider: invoice.provider.organization,
                acc_person: invoice.provider.acc_person,
                address: invoice.provider.address,
                vat: invoice.provider.vat,
                vat2: invoice.provider.vat2,
            };
        });
        worksheet.addRows(worksheet_data);

        const file_name = app.getPath('userData') + '/' + new Date().getTime() + '.xlsx';

        workbook.xlsx.writeFile(file_name).then(function () {
            send({
                subject: send_data.subject,
                html: (send_data.mail_text || ''),
                files: [file_name]
            }, (err, res) => {

                if (err) {
                    event.sender.send('invoices:send:response', {
                        error: err,
                        response: res,
                        rows_updated: []
                    });
                } else {
                    let i = 0;
                    send_data.invoices.forEach((invoice, idx) => {
                        invoices_db.update({
                            _id: invoice._id
                        }, { $set: { status: 'archived' } }, {}, (err, rows_updated) => {
                            i++;
                            if (i === send_data.invoices.length)
                                event.sender.send('invoices:send:response', {
                                    error: err,
                                    response: res,
                                    rows_updated: rows_updated
                                });
                        });
                    });
                }
            });
        });
    });
});

ipcMain.on('providers:all', (event, filter) => {
    if (!filter) filter = {};
    providers_db.find(filter, (err, providers) => {
        if (err)
            console.log(err);
        event.sender.send('providers:all:response', providers);
    });
});

ipcMain.on('provider:get', (event, id) => {
    providers_db.find({
        _id: id
    }, (err, provider) => {
        if (err)
            console.log(err);
        event.sender.send('provider:get:response', provider);
    });
});

ipcMain.on('provider:save', (event, provider) => {
    let new_provider = JSON.parse(JSON.stringify(provider));
    delete new_provider._id;

    if (provider._id) {
        providers_db.update({
            _id: provider._id
        }, new_provider, {}, (err, rows_updated) => {
            event.sender.send('provider:save:response', provider);
        });
    } else {
        providers_db.insert(new_provider, (err, provider_new) => {
            event.sender.send('provider:save:response', provider_new);
        });
    }
});

ipcMain.on('provider:remove', (event, provider) => {
    if (provider._id) {
        providers_db.remove({
            _id: provider._id
        }, (err, deleted_rows) => {
            if (deleted_rows > 0)
                event.sender.send('provider:remove:response', [provider]);
            else
                event.sender.send('provider:remove:response', []);
        });
    } else {
        event.sender.send('provider:remove:response', []);
    }
});

ipcMain.on('recipients:all', (event, filter) => {
    if (!filter) filter = {};
    recipients_db.find(filter, (err, recipients) => {
        if (err)
            console.log(err);

        let i = 0;

        recipients.forEach(recipient => {
            invoices_db.find({
                'recipient._id': recipient._id
            }, (err, invoices) => {
                recipient.invoices = invoices;
                i++;
                if (recipients.length === i)
                    event.sender.send('recipients:all:response', recipients);
            });
        });
    });
});

ipcMain.on('recipient:get', (event, id) => {
    recipients_db.find({
        _id: id
    }, (err, recipient) => {
        if (err)
            console.log(err);
        event.sender.send('recipient:get:response', recipient);
    });
});

ipcMain.on('recipient:save', (event, recipient) => {
    let new_recipient = JSON.parse(JSON.stringify(recipient));
    delete new_recipient._id;

    if (recipient._id) {
        recipients_db.update({
            _id: recipient._id
        }, new_recipient, {}, (err, rows_updated) => {
            event.sender.send('recipient:save:response', recipient);
        });
    } else {
        recipients_db.insert(new_recipient, (err, recipient_new) => {
            event.sender.send('recipient:save:response', recipient_new);
        });
    }
});

ipcMain.on('recipient:remove', (event, recipient) => {
    if (recipient._id) {
        recipients_db.remove({
            _id: recipient._id
        }, (err, deleted_rows) => {
            if (deleted_rows > 0)
                event.sender.send('recipient:remove:response', recipient);
            else
                event.sender.send('recipient:remove:response', '');
        });
    } else {
        event.sender.send('recipient:remove:response', '');
    }
});

ipcMain.on('settings:get', (event, setting) => {
    settings_db.find({
        setting: setting
    }, (err, settings) => {
        if (err)
            console.log(err);
        event.sender.send('settings:get:response', settings);
    });
});

ipcMain.on('settings:email:get', (event) => {
    settings_db.find({
        setting: 'email'
    }, (err, settings) => {
        if (err)
            console.log(err);
        event.sender.send('settings:email:get:response', settings);
    });
});

function _getEmailSettings(callback) {
    settings_db.find({
        setting: 'email'
    }, (err, sender) => {
        if (err)
            console.log(err);

        settings_db.find({
            setting: 'receiver'
        }, (err, receiver) => {
            if (err)
                console.log(err);

            callback.apply(null, [{
                sender: sender,
                receiver: receiver
            }]);
        });
    });
}

ipcMain.on('settings:receiver:get', (event) => {
    settings_db.find({
        setting: 'receiver'
    }, (err, settings) => {
        if (err)
            console.log(err);
        event.sender.send('settings:receiver:get:response', settings);
    });
});

ipcMain.on('settings:save', (event, settings) => {
    let new_settings = JSON.parse(JSON.stringify(settings));
    delete new_settings._id;

    if (settings._id) {
        settings_db.update({
            _id: settings._id
        }, new_settings, {}, (err, rows_updated) => {
            event.sender.send('settings:save:response', settings);
        });
    } else {
        settings_db.insert(new_settings, (err, settings_new) => {
            event.sender.send('settings:save:response', settings_new);
        });
    }
});
