'use strict';

const fs = require('fs');
const path = require('path');
const electron = require('electron');
const childProcess = require('child_process');
const appMenu = require('./menu.js');
const windowStateKeeper = require('electron-window-state');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const child_process = require('child_process');

let mainWindow;

function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

// Show a context menu on right click for copy/paste/save-image
require('electron-context-menu')({
        showInspectElement: false
});

app.on('ready', () => {
    if (!isEmptyObject(appMenu)) {
        electron.Menu.setApplicationMenu(appMenu);
    }

    let mainWindowState = windowStateKeeper({
      defaultWidth: 1000,
      defaultHeight: 800
    });

    function createWindow() {

      mainWindow = new BrowserWindow({
          title: app.getName(),
          'x': mainWindowState.x,
          'y': mainWindowState.y,
          'width': mainWindowState.width,
          'height': mainWindowState.height,
          minWidth: 500,
          minHeight: 300,
          icon: 'resources/icon.png',
          show: false,
          webPreferences: {
              nodeIntegration: false
          }
      });

      mainWindow.loadURL('https://forum.snapcraft.io/');

      var wc = mainWindow.webContents;

      wc.on('will-navigate', function(e, url) {
        /* If url isn't the actual page */
        if(url != wc.getURL()) {
          e.preventDefault();
          const page = unescape(url).split('url=')[1];
          child_process.execSync('xdg-open ' + page);
        }
      });

      // only show window when content is ready (prevents white window on startup)
      mainWindow.on('ready-to-show', function() {
          mainWindow.show();
          mainWindow.focus();
      });
      mainWindow.on('closed', () => {
          mainWindow = null;
      });
    }

    createWindow();

    mainWindowState.manage(mainWindow);

    const page = mainWindow.webContents;

    page.on('dom-ready', () => {
        page.insertCSS(
            fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'));
    })

    // Make ctrl+click open links in default browser, not in new electron window
    page.on('new-window', function(url) {
          child_process.execSync('xdg-open ' + url);
    });
});

// Quit when all windows are closed, except on OS X
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {

});

// On OS X, recreate app window if dock icon is clicked and no windows are open
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
