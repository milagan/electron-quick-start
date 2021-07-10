// Modules to control application life and create native browser window
const { app, Menu, Tray, BrowserWindow } = require('electron')
const url = require('url')
const path = require('path')

const args = require('./args')
const squirrel = require('./squirrel')

const cmd = args.parseArguments(app, process.argv.slice(1)).squirrelCommand
if (process.platform === 'win32' && squirrel.handleCommand(app, cmd)) {
  return
}

let isQuiting = false
let mainWindow
let appIcon
let contextMenu

function createWindow() {

  const iconImage = path.join(__dirname, 'resources/win32.ico')

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    icon: iconImage,
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
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: function () {
        isQuiting = true;
        app.quit();
      }
    }
  ])


  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu)
  appIcon.on('click', function (event) {
    console.log('App icon clicked')
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
