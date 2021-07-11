// Modules to control application life and create native browser window
const electron = require("electron")
const { app, Menu, Tray, BrowserWindow } = electron
const url = require('url')
const path = require('path')

const args = require('./args')
const squirrel = require('./squirrel')

const cmd = args.parseArguments(app, process.argv.slice(1)).squirrelCommand
if (process.platform === 'win32' && squirrel.handleCommand(app, cmd)) {
  return
}

let width = 400;
let height = 700;
let isQuiting = false
let mainWindow
let appIcon
let contextMenu
let margin_x = 0
let margin_y = 0

function createWindow() {

  const iconImage = path.join(__dirname, 'resources/win32.ico')

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    resizable: false,
    icon: iconImage,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // hide the menu
  mainWindow.setMenuBarVisibility(false)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('close', function (event) {
    if (!isQuiting) {
      event.preventDefault()
      mainWindow.hide()
      event.returnValue = false
    }
  });

  mainWindow.on('minimize', function (event) {
    event.preventDefault()
    mainWindow.hide()
  });

  mainWindow.on('show', function () {
    console.log('Main Window shown')
  });

  mainWindow.once('ready-to-show', () => {
    alignWindow()
    mainWindow.show()
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  if (process.platform === 'linux') {
    appIcon = new Tray(path.join(__dirname, 'resources/linux.png'))
  } else if (process.platform === 'darwin') {
    appIcon = new Tray(path.join(__dirname, 'resources/osx-tray.png'))
  } else if (process.platform === 'win32') {
    appIcon = new Tray(path.join(__dirname, 'resources/win32.ico'))
  }

  contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Application',
      click: function () {
        mainWindow.show()
      }
    },
    {
      label: 'Quit',
      click: function () {
        isQuiting = true;
        app.quit()
      }
    }
  ])


  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu)
  appIcon.on('click', function (event) {
    mainWindow.show()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  // if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function alignWindow() {
  const position = calculateWindowPosition();
  mainWindow.setBounds({
    width: width,
    height: height,
    x: position.x,
    y: position.y
  });
}

function calculateWindowPosition() {
  const screenBounds = electron.screen.getPrimaryDisplay().size;
  const trayBounds = appIcon.getBounds();

  //where is the icon on the screen?
  let trayPos = 4; // 1:top-left 2:top-right 3:bottom-left 4.bottom-right
  trayPos = trayBounds.y > screenBounds.height / 2 ? trayPos : trayPos / 2;
  trayPos = trayBounds.x > screenBounds.width / 2 ? trayPos : trayPos - 1;

  let DEFAULT_MARGIN = { x: margin_x, y: margin_y };

  //calculate the new window position
  switch (trayPos) {
    case 1: // for TOP - LEFT
      x = Math.floor(trayBounds.x + DEFAULT_MARGIN.x + trayBounds.width / 2);
      y = Math.floor(trayBounds.y + DEFAULT_MARGIN.y + trayBounds.height / 2);
      break;

    case 2: // for TOP - RIGHT
      x = Math.floor(
        trayBounds.x - width - DEFAULT_MARGIN.x + trayBounds.width / 2
      );
      y = Math.floor(trayBounds.y + DEFAULT_MARGIN.y + trayBounds.height / 2);
      break;

    case 3: // for BOTTOM - LEFT
      x = Math.floor(trayBounds.x + DEFAULT_MARGIN.x + trayBounds.width / 2);
      y = Math.floor(
        trayBounds.y - height - DEFAULT_MARGIN.y + trayBounds.height / 2
      );
      break;

    case 4: // for BOTTOM - RIGHT
      x = Math.floor(
        trayBounds.x - width - DEFAULT_MARGIN.x + trayBounds.width / 2
      );
      y = Math.floor(
        trayBounds.y - height - DEFAULT_MARGIN.y + trayBounds.height / 2
      );
      break;
  }

  return { x: x, y: y };
}
