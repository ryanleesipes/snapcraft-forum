'use strict';

const electron = require('electron');
const app = electron;
const child_process = require('child_process');

// when we start there is no appName yet, hardcode it for now
const appName = 'snapcraft.io';

const Template = [
    {
        label: appName,
        role: 'window',
        submenu: [
            {
                label: `Quit`,
                accelerator: 'CmdorCtrl+Q',
                role: 'close'
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            }
        ]
    },
    {
        label: 'Go',
        submenu: [
            {
                label: 'Back',
                accelerator: 'Alt+Left',
                click() {
                    app.BrowserWindow.getFocusedWindow().webContents.goBack();
                }
            },
            {
                label: 'Forward',
                accelerator: 'Alt+Right',
                click() {
                    app.BrowserWindow.getFocusedWindow().webContents.goForward();
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                role: 'reload'
            }
        ]
    },
    {
        label: 'Help',
        role: 'help',
        submenu: [
            {
                label: `https://snapcraft.io`,
                accelerator: 'CmdOrCtrl+H',
                click() {
                    child_process.execSync('xdg-open https://snapcraft.io');
                }
            }
        ]
    }
];

module.exports = electron.Menu.buildFromTemplate(Template);
