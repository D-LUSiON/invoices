const env = require('./environment.js');
const root_dir = env.production ? '.' : '..';

const {
    app,
    BrowserWindow,
    ipcMain,
    globalShortcut
} = require('electron');

const path = require('path');
const url = require('url');
const fs = require('fs');

const Datastore = require('nedb');
const RethinkDB = require('rethinkdb');

const windowStateKeeper = require('electron-window-state');

if (!env.production) {
    app.setName(`${app.getName()} (development mode)`);
    app.setPath('userData', `${app.getPath('userData')}-dev`);
}

let mainWindow;

function createWindow() {
    // Initialize window state keeper

    // FIXME: windowStateKeeper does not remember window position
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
        icon: `file://${path.join(__dirname, root_dir, env.html_src, 'assets', 'app-icon-l.jpg')}`
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, root_dir, env.html_src, 'index.html'),
        protocol: 'file:',
        slashes: true,
        webPreferences: {
            webSecurity: false
        }
    }));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        winState.manage(mainWindow);
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
// if (!env.production)
//     require('electron-reload')(
//         path.join(__dirname, '..'), {
//             ignored: /node_modules|[\/\\]\./,
//             electron: path.join(__dirname, '..', 'node_modules', 'electron', 'dist', 'electron.exe')
//         }
//     );

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


/******************************/
/******* EXAMPLE EVENTS *******/
/******************************/

// Event handler for asynchronous incoming messages
// ipcMain.on('asynchronous-message', (event, arg) => {
//     console.log(arg);

//     // Event emitter for sending asynchronous messages
//     event.sender.send('asynchronous-reply', 'async pong')
// });

// Event handler for synchronous incoming messages
// ipcMain.on('synchronous-message', (event, arg) => {
//     console.log(arg);

//     // Synchronous event emmision
//     event.returnValue = 'sync pong'
// });

// /***************************************/
// /******* FRONT-END COMMUNICATION *******/
// /***************************************/

// /**********************/
// /******* TODOs: *******/
// /**********************/
// TODO: Create "ORM" for local and remote databases
// TODO: Migrate all callbacks to promises

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

// TODO: Create config file or move to settings
const DB_NAME = env.production ? 'invoices' : 'invoices_dev';
const DB_TABLE_INVOICES_NAME = 'invoices';
const DB_TABLE_PROVIDERS_NAME = 'providers';
const DB_TABLE_RECIPIENTS_NAME = 'recipients';
const database_settings = {
    host: '',
    port: '',
    user: '',
    password: '',
};
let db_conn;

// TODO: Implement "node-keytar" for secure password storing
settings_db.find({
    setting: 'database'
}, (err, settings) => {
    if (err)
        console.log(err);

    if (settings[0] && settings[0]['value'] && settings[0]['value']['host']) {
        const host_port = settings[0]['value']['host'].split(':');
        if (host_port[0] && host_port[1]) {
            database_settings.host = host_port[0];
            database_settings.port = host_port[1] || 28015;

            if (settings[0]['value']['user'])
                database_settings.user = settings[0]['value']['user'];
            else
                delete database_settings.user;

            if (settings[0]['value']['password'])
                database_settings.password = settings[0]['value']['password'];
            else {
                delete database_settings.password;
            }
            console.log('Connecting to RethinkDB with these settings:', database_settings);

            RethinkDB.connect(database_settings).then(conn => {
                db_conn = conn;
                console.log(`Successfuly connected to RethinkDB on "${database_settings.host}:${database_settings.port}"`);
                syncDatabase();
            }).catch(err => {
                console.log('RethinkDB remote database not available!');
            });
        }
    }
});

async function createDb(db_name) {
    return RethinkDB.dbCreate(db_name).run(db_conn);
}

async function createTable(db_name, table_name) {
    return RethinkDB.db(db_name).tableCreate(table_name).run(db_conn);
}

async function initRemoteDB() {
    await Promise.all([
        createDb(DB_NAME),
        createTable(DB_NAME, DB_TABLE_INVOICES_NAME),
        createTable(DB_NAME, 'providers'),
        createTable(DB_NAME, 'recipients'),
    ]);
}

function syncDatabase() {
    if (db_conn) {
        RethinkDB.dbList().run(db_conn).then(databases => {
            if (!databases.includes(DB_NAME)) {
                initRemoteDB().then(values => {
                    Promise.all([
                        new Promise(resolve => {
                            invoices_db.find({}, (err, invoices) => {
                                RethinkDB
                                    .db(DB_NAME)
                                    .table(DB_TABLE_INVOICES_NAME)
                                    .insert([...invoices])
                                    .run(db_conn)
                                    .then(result => {
                                        resolve(result);
                                    });
                            });
                        }),
                        new Promise(resolve => {
                            providers_db.find({}, (err, providers) => {
                                RethinkDB
                                    .db(DB_NAME)
                                    .table(DB_TABLE_PROVIDERS_NAME)
                                    .insert([...providers])
                                    .run(db_conn)
                                    .then(result => {
                                        resolve(result);
                                    });
                            });
                        }),
                        new Promise(resolve => {
                            recipients_db.find({}, (err, recipients) => {
                                RethinkDB
                                    .db(DB_NAME)
                                    .table(DB_TABLE_RECIPIENTS_NAME)
                                    .insert([...recipients])
                                    .run(db_conn)
                                    .then(result => {
                                        resolve(result);
                                    });
                            });
                        }),
                    ]);
                });
            } else {
                // TODO: Get all invoices from remote DB and sync them with locally stored
            }
        }).catch(err => {
            console.log('Error listing databases!', err);
        });
    }
}

/** Invoices related stuff starts here **/
/****************************************/
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
    _saveInvoiceRecipient(invoice, (updated_invoice) => {
        _saveInvoiceProvider(updated_invoice, (upd_invoice) => {
            const new_invoice = JSON.parse(JSON.stringify(upd_invoice));
            delete new_invoice._id;
            delete new_invoice.id;

            if (upd_invoice._id) {
                invoices_db.update({
                    _id: upd_invoice._id
                }, new_invoice, {}, (err, rows_updated) => {
                    if (db_conn) {
                        RethinkDB
                            .db(DB_NAME)
                            .table(DB_TABLE_INVOICES_NAME)
                            .get(upd_invoice.id)
                            .update(new_invoice)
                            .run(db_conn)
                            .then(result => {
                                if (result.errors) {
                                    console.log('Error updating invoice in remote DB!');
                                    event.sender.send('invoice:save:response', upd_invoice);
                                } else {
                                    console.log('Successfuly updated invoice in remote DB!');
                                    event.sender.send('invoice:save:response', upd_invoice);
                                }
                            });
                    } else
                        event.sender.send('invoice:save:response', upd_invoice);
                });
            } else {
                invoices_db.insert(new_invoice, (err, invoice_new) => {
                    if (db_conn) {
                        RethinkDB
                            .db(DB_NAME)
                            .table(DB_TABLE_INVOICES_NAME)
                            .insert(invoice_new)
                            .run(db_conn)
                            .then(result => {
                                if (result.errors) {
                                    console.log('Error inserting invoice in remote DB!');
                                    event.sender.send('invoice:save:response', invoice_new);
                                } else if (result.inserted) {
                                    console.log('Invoice inserted!', result);
                                    invoice_new.id = result.generated_keys[0];
                                    invoices_db.update({
                                            _id: invoice_new._id
                                        }, {
                                            id: invoice_new.id
                                        }, {},
                                        (err) => {
                                            if (err)
                                                console.log('Error updating invoice with remote ID!', err);

                                            event.sender.send('invoice:save:response', invoice_new);
                                        });
                                }
                            })
                            .catch(err => {
                                console.log('Error inserting invoice!');
                                event.sender.send('invoice:save:response', invoice_new);
                            });
                    } else
                        event.sender.send('invoice:save:response', invoice_new);
                });
            }
        });
    });
});

function _saveInvoiceProvider(invoice, callback) {
    if (invoice.provider) {
        const new_provider = JSON.parse(JSON.stringify(invoice.provider));
        delete new_provider._id;
        delete new_provider.id;

        if (invoice.provider._id) {
            providers_db.update({
                _id: invoice.provider._id
            }, new_provider, {}, (err, rows_updated) => {
                if (db_conn) {
                    RethinkDB
                        .db(DB_NAME)
                        .table(DB_TABLE_PROVIDERS_NAME)
                        .get(invoice.provider.id)
                        .update(new_provider)
                        .run(db_conn)
                        .then(result => {
                            if (result.errors) {
                                console.log('Error updating provider in remote DB!');
                                callback.call(null, invoice);
                            } else {
                                console.log('Successfuly updated provider in remote DB!');
                                callback.call(null, invoice);
                            }
                        });
                } else
                    callback.call(null, invoice);
            });
        } else {
            providers_db.insert(new_provider, (err, provider_new) => {
                invoice.provider = JSON.parse(JSON.stringify(provider_new));
                if (db_conn) {
                    RethinkDB
                        .db(DB_NAME)
                        .table(DB_TABLE_PROVIDERS_NAME)
                        .insert(provider_new)
                        .run(db_conn)
                        .then(result => {
                            if (result.errors) {
                                console.log('Error inserting provider in remote DB!');
                                callback.call(null, invoice);
                            } else if (result.inserted) {
                                console.log('Provider inserted!', result);
                                provider_new.id = result.generated_keys[0];
                                providers_db.update({
                                        _id: provider_new._id
                                    }, {
                                        id: provider_new.id
                                    }, {},
                                    (err) => {
                                        if (err)
                                            console.log('Error updating provider!', err);
                                        else {
                                            invoice.provider = provider_new;
                                        }
                                        callback.call(null, invoice);
                                    });
                            }
                        })
                        .catch(err => {
                            console.log('Error inserting provider!');
                            callback.call(null, invoice);
                        });
                } else
                    callback.call(null, invoice);
            });
        }
    }
}

function _saveInvoiceRecipient(invoice, callback) {
    if (invoice.recipient) {
        const new_recipient = JSON.parse(JSON.stringify(invoice.recipient));
        delete new_recipient._id;
        delete new_recipient.id;

        if (invoice.recipient._id) {
            recipients_db.update({
                _id: invoice.recipient._id
            }, new_recipient, {}, (err, rows_updated) => {
                if (db_conn) {
                    RethinkDB
                        .db(DB_NAME)
                        .table(DB_TABLE_RECIPIENTS_NAME)
                        .get(invoice.recipient.id)
                        .update(new_recipient)
                        .run(db_conn)
                        .then(result => {
                            if (result.errors) {
                                console.log('Error updating recipient in remote DB!');
                                callback.call(null, invoice);
                            } else {
                                console.log('Successfuly updated recipient in remote DB!');
                                callback.call(null, invoice);
                            }
                        });
                } else
                    callback.call(null, invoice);
            });
        } else {
            recipients_db.insert(new_recipient, (err, recipient_new) => {
                invoice.recipient = JSON.parse(JSON.stringify(recipient_new));
                if (db_conn) {
                    RethinkDB
                        .db(DB_NAME)
                        .table(DB_TABLE_RECIPIENTS_NAME)
                        .insert(recipient_new)
                        .run(db_conn)
                        .then(result => {
                            // recipients_db.update({ '_id': recipient_new._id }, { 'id': result.id })
                            console.log('Recipient inserted!', result);
                        })
                        .catch(err => {
                            console.log('Error inserting recipient!');
                        });
                }
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
            if (deleted_rows > 0) {
                event.sender.send('invoice:remove:response', [invoice]);
            } else
                event.sender.send('invoice:remove:response', []);

            if (db_conn) {
                RethinkDB
                    .db(DB_NAME)
                    .table(DB_TABLE_INVOICES_NAME)
                    .get(invoice.id)
                    .delete()
                    .run(db_conn)
                    .then(result => {
                        if (result.deleted)
                            console.log('Successfuly deleted invoice in remote DB!');
                    });
            }
        });
    } else {
        event.sender.send('invoice:remove:response', []);
    }
});

/** Providers related stuff starts here **/
/*****************************************/
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
    delete new_provider.id;

    if (provider._id) {
        providers_db.update({
            _id: provider._id
        }, new_provider, {}, (err, rows_updated) => {
            if (db_conn) {
                RethinkDB
                    .db(DB_NAME)
                    .table(DB_TABLE_PROVIDERS_NAME)
                    .get(provider.id)
                    .update(new_provider)
                    .run(db_conn)
                    .then(result => {
                        if (result.errors) {
                            console.log('Error updating provider in remote DB!');
                            event.sender.send('provider:save:response', provider);
                        } else {
                            console.log('Successfuly updated provider in remote DB!');
                            event.sender.send('provider:save:response', provider);
                        }
                    });
            } else
                event.sender.send('provider:save:response', provider);
        });
    } else {
        providers_db.insert(new_provider, (err, provider_new) => {
            if (db_conn) {
                RethinkDB
                    .db(DB_NAME)
                    .table(DB_TABLE_PROVIDERS_NAME)
                    .insert(provider_new)
                    .run(db_conn)
                    .then(result => {
                        if (result.errors) {
                            console.log('Error inserting provider in remote DB!');
                            event.sender.send('provider:save:response', provider_new);
                        } else if (result.inserted) {
                            console.log('Provider inserted!', result);
                            provider_new.id = result.generated_keys[0];
                            providers_db.update({
                                    _id: provider_new._id
                                }, {
                                    id: provider_new.id
                                }, {},
                                (err) => {
                                    if (err)
                                        console.log('Error updating provider!', err);
                                    event.sender.send('provider:save:response', provider_new);
                                });
                        }
                    })
                    .catch(err => {
                        console.log('Error inserting provider!');
                        event.sender.send('provider:save:response', provider_new);
                    });
            } else
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

            if (db_conn) {
                RethinkDB
                    .db(DB_NAME)
                    .table(DB_TABLE_PROVIDERS_NAME)
                    .get(provider.id)
                    .delete()
                    .run(db_conn)
                    .then(result => {
                        if (result.deleted)
                            console.log('Successfuly deleted provider in remote DB!');
                    });
            }
        });
    } else {
        event.sender.send('provider:remove:response', []);
    }
});


/** Recipients related stuff starts here **/
/******************************************/
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
            if (db_conn) {
                RethinkDB
                    .db(DB_NAME)
                    .table(DB_TABLE_RECIPIENTS_NAME)
                    .get(recipient.id)
                    .update(new_recipient)
                    .run(db_conn)
                    .then(result => {
                        if (result.errors) {
                            console.log('Error updating recipient in remote DB!');
                            event.sender.send('recipient:save:response', recipient);
                        } else {
                            console.log('Successfuly updated recipient in remote DB!');
                            event.sender.send('recipient:save:response', recipient);
                        }
                    });
            } else
                event.sender.send('recipient:save:response', recipient);
        });
    } else {
        recipients_db.insert(new_recipient, (err, recipient_new) => {
            if (db_conn) {
                RethinkDB
                    .db(DB_NAME)
                    .table(DB_TABLE_RECIPIENTS_NAME)
                    .insert(recipient_new)
                    .run(db_conn)
                    .then(result => {
                        if (result.errors) {
                            console.log('Error inserting recipient in remote DB!');
                            event.sender.send('recipient:save:response', recipient_new);
                        } else if (result.inserted) {
                            console.log('Provider inserted!', result);
                            recipient_new.id = result.generated_keys[0];
                            recipients_db.update({
                                    _id: recipient_new._id
                                }, {
                                    id: recipient_new.id
                                }, {},
                                (err) => {
                                    if (err)
                                        console.log('Error updating recipient!', err);
                                    event.sender.send('recipient:save:response', recipient_new);
                                });
                        }
                    })
                    .catch(err => {
                        console.log('Error inserting recipient!');
                        event.sender.send('recipient:save:response', recipient_new);
                    });
            } else
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

            if (db_conn) {
                RethinkDB
                    .db(DB_NAME)
                    .table(DB_TABLE_RECIPIENTS_NAME)
                    .get(recipient.id)
                    .delete()
                    .run(db_conn)
                    .then(result => {
                        if (result.deleted)
                            console.log('Successfuly deleted recipient in remote DB!');
                    });
            }
        });
    } else {
        event.sender.send('recipient:remove:response', '');
    }
});


/** Settings related stuff starts here **/
/****************************************/
ipcMain.on('settings:get', (event, setting) => {
    console.log('settings:get', setting);

    settings_db.find({
        setting: setting
    }, (err, settings) => {
        if (err)
            console.log(err);

        console.log('settings:get:response', settings);
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

ipcMain.on('settings:receiver:get', (event) => {
    settings_db.find({
        setting: 'receiver'
    }, (err, settings) => {
        if (err)
            console.log(err);
        event.sender.send('settings:receiver:get:response', settings);
    });
});

ipcMain.on('settings:database:get', (event) => {
    settings_db.find({
        setting: 'database'
    }, (err, settings) => {
        if (err)
            console.log(err);
        event.sender.send('settings:database:get:response', settings);
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

/** Manual syncronization of databases **/
/****************************************/
ipcMain.on('sync_all', (event) => {
    // TODO: Create manual sync of databases
    event.sender.send('sync_all:response', {
        error: 0,
        message: 'Databases synced successfuly!'
    });
});


/** Sending invoices via email  starts here **/
/*********************************************/

const Excel = require('exceljs');

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

ipcMain.on('invoices:send', (event, send_data) => {
    _getEmailSettings(email_setttings => {
        const GmailAPI = require('gmail-send')({
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

        // TODO: Create external templpate for .xlsx columns
        worksheet.columns = [{
                header: 'Номер на фактура',
                key: 'number',
                width: 20
            },
            {
                header: 'Издадена на',
                key: 'issue_date',
                width: 15
            },
            {
                header: 'Данъчна основа',
                key: 'total_sum',
                width: 20
            },
            {
                header: 'ДДС 20%',
                key: 'total_vat',
                width: 10
            },
            {
                header: 'Общо',
                key: 'total_total',
                width: 10
            },
            // {
            //     header: 'Тип',
            //     key: 'type',
            //     width: 10
            // },
            // {
            //     header: 'Бележки',
            //     key: 'notes',
            //     width: 20
            // },
            // {
            //     header: 'Доставчик',
            //     key: 'provider',
            //     width: 30
            // },
            // {
            //     header: 'Доставчик - МОЛ',
            //     key: 'acc_person',
            //     width: 20
            // },
            // {
            //     header: 'Доставчик - Адрес',
            //     key: 'address',
            //     width: 30
            // },
            // {
            //     header: 'Доставчик - ДДС номер',
            //     key: 'vat',
            //     width: 30
            // },
            // {
            //     header: 'Доставчик - ИН/ЕГН',
            //     key: 'vat2',
            //     width: 30
            // },
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

        let now = new Date();
        now = new Date(now.getTime() + (Math.abs(now.getTimezoneOffset() * 1000 * 60)));

        const dest_path = `${app.getPath('documents')}/${app.getName().replace(/[\\\/\:\*\?\"\<\>\|]/g, '-').trim()}`;
        const file_name = `${now.toISOString().replace(/[tz]/ig, ' ').trim().replace(/[\\\/\:\*\?\"\<\>\|]/g, '-').replace(/\.\d+$/, '')}.xlsx`;
        const full_file_path = path.join(dest_path, file_name).replace(/\s/g, '\ ');

        if (!fs.existsSync(dest_path))
            fs.mkdirSync(dest_path);

        workbook.xlsx.writeFile(full_file_path).then(() => {
            // Send via gmail to accountant
            GmailAPI({
                subject: send_data.subject,
                html: (send_data.mail_text || ''),
                files: [{
                    path: full_file_path,
                    filename: file_name
                }]
            }, (err, res) => {

                if (err) {
                    console.error(err);
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
                        }, {
                            $set: {
                                status: 'archived'
                            }
                        }, {}, (err, rows_updated) => {
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
        }).catch(err => {
            console.log('Error writing .xlsx file!', err);
            event.sender.send('invoices:send:response', {
                error: err,
                response: 'Error writing .xlsx file!',
                rows_updated: []
            });
        });
    });
});
