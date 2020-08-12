const { app } = require('electron');
const path = require('path');
const fs = require('fs-extra');

class ErrorLog {
    constructor(module_name) {
        this.module_name = module_name;
        this.log_path = app.getPath('logs');
        this.log_file_name = 'errors.log';
        this.log_file_path = path.join(this.log_path, this.log_file_name);
        fs.ensureDirSync(this.log_path);
        if (!fs.existsSync(this.log_file_path))
            fs.createFileSync(this.log_file_path);
        this.log_stream = fs.createWriteStream(this.log_file_path, { flags: 'a' });
        this.log_stream.on('error', (error) => {
            console.error(`Error writing log file!`, error);
        });
    }

    logError(heading, message) {
        const now = new Date();
        let year = now.getFullYear().toString();

        let month = now.getMonth().toString();
        if (month.length < 2) month = `0${month}`;

        let day = now.getDate().toString();
        if (day.length < 2) day = `0${day}`;

        let hour = now.getHours().toString();
        if (hour.length < 2) hour = `0${hour}`;

        let minutes = now.getMinutes().toString();
        if (minutes.length < 2) minutes = `0${minutes}`;

        let seconds = now.getSeconds().toString();
        if (seconds.length < 2) seconds = `0${seconds}`;

        message = `[${year}-${month}-${day} ${hour}:${minutes}:${seconds}] ${this.module_name}: ${heading} --- ${message}`;
        console.error(message);
        this.log_stream.write(message);
        this.log_stream.end(`\n`);
    }
}


module.exports = ErrorLog;
