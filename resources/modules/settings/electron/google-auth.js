const fs = require('fs-extra');
const path = require('path');
const CryptoJS = require('crypto-js');
const MachineID = require('node-machine-id');
const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2').default;
const { app } = require('electron');

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const GOOGLE_PROFILE_URL = 'https://www.googleapis.com/userinfo/v2/me';

class GoogleAuth {

    constructor() {
        this.token_path = path.join(app.getPath('userData'), 'gtoken');
        this.machine_id = MachineID.machineIdSync();
        this.refreshToken = '';
        this.getRefreshToken().then(() => {
            if (!this.myApiOauth)
                this.myApiOauth = new ElectronGoogleOAuth2(
                    '775145885179-u4s476qa9vqj2tfpioi43kp4hd7vt33l.apps.googleusercontent.com',
                    'Ev12Xl4xqnt3K9rUNkkos5YV',
                    [
                        'https://www.googleapis.com/auth/drive.metadata.readonly',
                        'https://www.googleapis.com/auth/drive.appdata',
                        'https://www.googleapis.com/auth/drive.file',
                        'https://www.googleapis.com/auth/gmail.send',
                        'https://www.googleapis.com/auth/gmail.compose',
                    ]
                );
        });
    }

    getRefreshToken() {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(this.token_path)) {
                fs.readFile(this.token_path).then(token_enc => {
                    const dectrypted = CryptoJS.AES.decrypt(token_enc.toString(), this.machine_id).toString(CryptoJS.enc.Utf8);
                    resolve(dectrypted);
                });
            } else
                resolve('');
        });
    }

    saveRefreshToken(token) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.token_path, CryptoJS.AES.encrypt(token, this.machine_id).toString(), 'utf8', async (err) => {
                if (err) {
                    console.error(`Error writing refresh token!`, err);
                    reject();
                } else {
                    this.refreshToken = await this.getRefreshToken();
                    resolve();
                }
            });
        });
    }

    login() {
        return new Promise(async (resolve, reject) => {
            this.refreshToken = await this.getRefreshToken();
            if (this.refreshToken) {
                this.myApiOauth.setTokens({ refresh_token: this.refreshToken });
                resolve();
            } else {
                this.myApiOauth.openAuthWindowAndGetTokens()
                    .then(token => {
                        this.access_token = token.access_token;
                        this.id_token = token.id_token;
                        fs.writeFile(path.join(app.getPath('userData'), 'gtokendata.json'), JSON.stringify({ ...token }, null, 4), 'utf8');
                        this.saveRefreshToken(token.refresh_token);
                        resolve(token);
                    }).catch((err) => {
                        console.error(`Error authorizing with Google!\n`, err);
                        app.emit('window-all-closed');
                    });
            }
        });
    }
}

module.exports = GoogleAuth;
