const path = require('path');
const electron = require('electron');
const {
    dialog,
} = electron;

class DataStore {
    constructor(app) {
        this.app = app;
        this.userData = app.getPath('userData');
        this.db_path = path.join(this.userData, 'database.sqlite3');
        this.connectToDatabase();
    }

    connectToDatabase() {
        const Sequelize = require('sequelize');
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: this.db_path
        });

        sequelize
            .authenticate()
            .then(() => {
                console.log('Sequelize: SQLite is working!');
            })
            .catch(err => {
                console.log('Sequelize: Error connecting to SQLite database!');
                console.log(JSON.stringify(err));
            });
    }
}

module.exports = DataStore;
