const { app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path');
const url = require('url');

// window 객체는 전역 변수로 유지. 이렇게 하지 않으면,
// 자바스크립트 객체가 가비지 콜렉트될 때 자동으로 창이 닫힐 것입니다.
let mainWindow
let imgwin

function createWindow () {
  // 브라우저 창을 생성합니다.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Toka',
    //transparent: true,
    //frame: false,
    //backgroundColor: '#00ff00',
    icon: __dirname + 'assets/icons/toka.png',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: `file://${__dirname}/preload.js`
    }
  })

  // 브라우저 창을 생성합니다.
  imgWindow = new BrowserWindow({
    parent: mainWindow,
    width: 480,
    height: 360,
    title: 'Toka Animation',
    //transparent: true,
    //frame: false,
    icon: __dirname + 'assets/icons/toka.png',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    }
  })
  imgWindow.setMenu(null);
  imgWindow.loadURL(`file://${__dirname}/anim.html`);

  // 앱의 index.html 파일을 로드합니다.
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  // 개발자 도구를 엽니다.
  //mainWindow.webContents.openDevTools();
  //imgWindow.webContents.openDevTools();
  // 창이 닫힐 때 발생합니다
  mainWindow.on('closed', () => {
    // window 객체에 대한 참조해제. 여러 개의 창을 지원하는 앱이라면
    // 창을 배열에 저장할 수 있습니다. 이곳은 관련 요소를 삭제하기에 좋은 장소입니다.
    mainWindow = null
  })
}

ipcMain.on('openAnim', function(event){
  if(imgWindow.isDestroyed()){
    // 브라우저 창을 생성합니다.
    imgWindow = new BrowserWindow({
      parent: mainWindow,
      width: 480,
      height: 360,
      title: 'Toka Animation',
      //transparent: true,
      //frame: false,
      icon: __dirname + 'assets/icons/toka.png',
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
      }
    })
    imgWindow.setMenu(null);
    imgWindow.loadURL(`file://${__dirname}/anim.html`);
    //imgWindow.webContents.openDevTools();
  } else {
    imgWindow.destroy();
  }
})

ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: '/path/to/icon.png'
  })
})

// 이 메서드는 Electron이 초기화를 마치고
// 브라우저 창을 생성할 준비가 되었을 때  호출될 것입니다.
// 어떤 API는 이 이벤트가 나타난 이후에만 사용할 수 있습니다.
app.on('ready', createWindow)

// 모든 창이 닫혔을 때 종료.
app.on('window-all-closed', () => {
  // macOS에서는 사용자가 명확하게 Cmd + Q를 누르기 전까지는
  // 애플리케이션이나 메뉴 바가 활성화된 상태로 머물러 있는 것이 일반적입니다.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // macOS에서는 dock 아이콘이 클릭되고 다른 윈도우가 열려있지 않았다면
  // 앱에서 새로운 창을 다시 여는 것이 일반적입니다.
  if (mainWindow === null) {
    createWindow()
  }
})
