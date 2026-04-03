const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("fctv", {
  setTitle: (t) => ipcRenderer.send("set-title", t)
});
