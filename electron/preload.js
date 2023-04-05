const { contextBridge, ipcRenderer } = require('electron')

// contextBridge.exposeInMainWorld('versions', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron,
//   ping: () => ipcRenderer.invoke('ping'),
//   myIpcRenderer: () => ipcRenderer
//   // 能暴露的不仅仅是函数，我们还可以暴露变量
// })
contextBridge.exposeInMainWorld('electron',{
    ipcRenderer,
    onUpdateCounter: (callback) => ipcRenderer.on('checking-for-update', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
    onDownloadProgress: (callback) => ipcRenderer.on('download-progress', callback),
})
window.addEventListener('DOMContentLoaded',() => {
    const replaceText = (selector,text) => {
        const element = document.getElementById(selector)
        if(element) element.innerText = text
    }

    for(const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`,process.version[dependency])
    }
})
// contextBridge.exposeInMainWorld("ipcRenderer",ipcRenderer)