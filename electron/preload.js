const { contextBridge, shell, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('Electron', {
  openExternal: (url) => shell.openExternal(url),
  aiQuery: async (question) => ipcRenderer.invoke('ai:query', question),
});
