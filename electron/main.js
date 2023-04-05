// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
const isDev = require('electron-is-dev')
const path = require('path')
// Object.defineProperty(app, 'isPackaged', {
//   get() {
//     return true;
//   }
// })
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
function createWindow() {
  // 创建浏览器窗口
  // const mainWindow = new BrowserWindow({
  //   width: 800, 
  //   height: 600,
  //   // icon: path.join(__dirname, '../public/xajd.ico'),
  //   // autoHideMenuBar: true, //隐藏菜单
  //   // fullscreen: true,
  //   webPreferences: {
  //     preload: path.join(__dirname, './preload.js'),
  //     webSecurity: false,
  //     enableRemoteModule: false, 
  //     nodeIntegration:true,
  //     // contextIsolation: false,
  //   }
  // }) 
  // // 加载 index.html
  // // mainWindow.loadFile('dist/index.html') 将该行改为下面这一行，加载url
  // mainWindow.loadURL(isDev? 'http://localhost:3000': `file://${path.join(__dirname, '../dist/index.html')}`);
  // console.log(mainWindow)
  // // 打开开发工具 
  //   if (isDev) {
  //     mainWindow.webContents.openDevTools()
  //   }
    
}
const returnData = {
  error: { status: -1, msg: '检测更新查询异常' },
  checking: { status: 0, msg: '正在检查应用程序更新' },
  updateAva: { status: 1, msg: '检测到新版本，正在下载,请稍后' },
  updateNotAva: { status: -1, msg: '您现在使用的版本为最新版本,无需更新!' },
};
app.setLoginItemSettings({
  openAtLogin: true
})
// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。GH_TOKEN   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

app.whenReady().then(() => {
  // autoUpdater.requestHeaders = { "Private-Token":  "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" }
  // autoUpdater.requestHeaders = { "GH_TOKEN":  "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" }
  // autoUpdater.setFeedUrl('https://81.70.44.15/')

  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    // icon: path.join(__dirname, '../public/xajd.ico'),
    // autoHideMenuBar: true, //隐藏菜单
    // fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      webSecurity: false,
      enableRemoteModule: false, 
      nodeIntegration:true,
      // contextIsolation: false,
    }
  }) 
  // 加载 index.html
  // mainWindow.loadFile('dist/index.html') 将该行改为下面这一行，加载url
  mainWindow.loadURL(isDev? 'http://localhost:3000/ZNDS/': `file://${path.join(__dirname, '../ZNDS/index.html')}`);
  console.log(mainWindow)
  // 打开开发工具  
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  autoUpdater.setFeedURL('http://81.70.44.15/')
  if(isDev) {
    autoUpdater.updateConfigPath = path.join( __dirname ,'../dev-app-update.yml')
  }
  ipcMain.on('vueEvent',() => {
    console.log('vue发来的信息') 
    autoUpdater.checkForUpdates()
  })
  console.log(process.versions)
  // ipcMain.on('checkForUpdate',() => {
  //   autoUpdater.checkForUpdates()
  // })
  autoUpdater.autoDownload = false
  // autoUpdater.checkForUpdatesAndNotify()
  autoUpdater.checkForUpdates()
  
  // dialog.showMessageBox('错误') 
 

  //更新错误
  autoUpdater.on('error', function (error) {
    console.log(error)
    dialog.showMessageBox({
      type: 'info',
      title: '更新错误',
      message: '更新错误',
  })
    // dialog.showErrorBox(error)
  });
  //检查中
  autoUpdater.on('checking-for-update', function () {
    // dialog.showMessageBox('正在检查应用程序更新') 
    mainWindow.webContents.send('checking-for-update','checking-for-update')
    console.log('正在检查应用程序更新')
  //   dialog.showMessageBox({
  //     type: 'info',
  //     title: '软件更新',
  //     message: '发现新版本2, 确定更新?',
  //     buttons: ['确定', '取消']
  // }).then(resp => {
  //     if (resp.response == 0) {
  //         // createWindow()
  //         autoUpdater.downloadUpdate()
  //     }
  // })
  });
  
  // dialog.showErrorBox('发现新版本')
  //发现新版本
  autoUpdater.on('update-available', function (info) {
    // dialog.showMessageBox('发现新版本')
    console.log('发现新版本')
    
    if (!isDev) {
      // dialog.showErrorBox(returnData.updateAva)
      // dialog.showErrorBox('发现新版本')
    } else {
      // dialog.showErrorBox(returnData.updateNotAva)
      // dialog.showErrorBox('发现新版本')
    }
    dialog.showMessageBox({
      type: "info",
      title: '应用有新的版本',
      message: '发现新的版本3，是否更新',
      buttons: ['是','否']
    },(buttonIndex) => {
      if(buttonIndex===0) {
        autoUpdater.downloadUpdate()
      }
    })
  });

  //当前版本为最新版本
  autoUpdater.on('update-not-available', function (info) {
    // dialog.showMessageBox('当前版本为最新版本')
    console.log('当前版本为最新版本')
    setTimeout(function () {
      // hotUpdate();//热更新检查
      // dialog.showErrorBox(returnData.updateNotAva)
    }, 1000);
    dialog.showMessageBox({
      title: '版本信息',
      message: '最新版本'
  })
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    mainWindow.webContents.send('download-progress',progressObj)
    // win.webContents.send('updateAppProgress', progressObj)
    // console.log('下载'+progressObj.percent)
    //   dialog.showMessageBox({
    //     title: '更新',
    //     message: `最新版本已下载完成, 退出程序进行安装${progressObj.percent}`
    // })
  });


  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    console.log('下载完成')
    mainWindow.webContents.send('update-downloaded',event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate)
    dialog.showMessageBox({
      title: '下载完成',
      message: '最新版本已下载完成, 退出程序进行安装'
  }).then(() => {
      autoUpdater.quitAndInstall()
  })
  });



  createWindow()

  app.on('activate', function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
// 也可以拆分成几个文件，然后用 require 导入。