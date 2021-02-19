const { app, BrowserWindow,ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const Store = require('./fileStore.js');
let win;
const store = new Store({
    // We'll call our data file 'user-preferences'
    configName: 'user-preferences',
    defaults:  { firstName:"first Name",lastName:"Last Name", email:"example@abc.com", phone:0}
  });
  ipcMain.on('ping', (event) => {
    event.sender.send('msg',store.path);
  });
  ipcMain.on('load-contact', (event) => {
    event.sender.send('contactLoaded',store.get());
  });
  ipcMain.on('save-contact', (event,data) => {
    store.set(data);
    event.sender.send('msg','success');
  });
function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 ,
    webPreferences: {
      nodeIntegration: true
    }});
  // load the dist folder from Angular

  win.loadURL(
    url.format({
        pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  win.once('show',()=>{
      win.webContents.send('contacts',store.get());
  })
  // The following is optional and will open the DevTools:
  // win.webContents.openDevTools()
  win.on("closed", () => {
    win = null;
  });
}
app.on("ready", createWindow);
// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});