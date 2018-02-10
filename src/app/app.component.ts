import { Component, NgZone, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Change this text in the .ts file to see how app IS refreshing!';
    messages: { [key: string]: any }[] = [];

    constructor(
        private electron: ElectronService,
        private ngZone: NgZone
    ) { }

    ngOnInit() {
        // Async message handler
        this.electron.ipcRenderer.on('asynchronous-reply', (event, response) => {
            // use NgZone to execute code after response, otherwise the view will not be updated
            this.ngZone.run(() => {
                let messages = this.messages.slice().reverse();
                messages.push({
                    time: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}.${new Date().getMilliseconds()}`,
                    type: 'response',
                    method: 'async',
                    text: response
                });
                this.messages = messages.reverse();
            });
        });
    }

    onGoBack(){
        alert('You can go back if you wish!');
    }

    onClickSync() {
        console.log('Syncronous button clicked!');
        // Synchronous message emmiter and handler
        let messages = this.messages.slice().reverse();
        messages.push({
            time: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}.${new Date().getMilliseconds()}`,
            type: 'request',
            method: 'sync',
            text: 'sync ping'
        });
        this.messages = messages.reverse();
        let response: string = this.electron.ipcRenderer.sendSync('synchronous-message', 'sync ping');
        messages = this.messages.slice().reverse();
        messages.push({
            time: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}.${new Date().getMilliseconds()}`,
            type: 'response',
            method: 'sync',
            text: response
        });
        this.messages = messages.reverse();
    }

    onClickAsync() {
        console.log('Asyncronous button clicked!');
        // Synchronous message emmiter and handler
        let messages = this.messages.slice().reverse();
        messages.push({
            time: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}.${new Date().getMilliseconds()}`,
            type: 'request',
            method: 'async',
            text: 'async ping'
        });
        this.messages = messages.reverse();
        this.electron.ipcRenderer.send('asynchronous-message', 'async ping');
    }

    onExitApp() {
        this.electron.remote.app.exit();
    }
}
