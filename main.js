const { app, BrowserWindow, session, ipcMain } = require("electron");
const path = require("path");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1400, height: 860, minWidth: 1000, minHeight: 650,
    title: "FCTV",
    backgroundColor: "#141414",
    autoHideMenuBar: true,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
    }
  });

  // Intercept requests — inject per-request headers stored by renderer
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ["http://*/*", "https://*/*"] },
    (details, callback) => {
      const h = { ...details.requestHeaders };
      // Only set UA if not already overridden by Shaka
      if (!h["User-Agent"] || h["User-Agent"].includes("Electron")) {
        h["User-Agent"] =
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
      }
      callback({ requestHeaders: h });
    }
  );

  ipcMain.on("set-title", (_e, title) => { if (win) win.setTitle(title); });

  win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
