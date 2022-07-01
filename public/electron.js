const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: "",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    }
  });
  
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  mainWindow.on("closed", () => (mainWindow = null));

  // Open devtools
  // mainWindow.webContents.openDevTools()
}


app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

electron.ipcMain.handle('database', (event, ...args) => {
  const {SQLiteDatabase} = require("./SQLiteDatabase");

  const defaultStorageFolder = app.getPath('appData');

  global.database = new SQLiteDatabase(path.join(defaultStorageFolder, 'lams.sqlite3'));
  event.sendReply('asynchronous-reply', 'pong')
});
