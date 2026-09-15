const {app,BrowserWindow,ipcMain,dialog,shell}=require('electron');
const path=require('path');
const fs=require('fs');
const {autoUpdater}=require('electron-updater');

let mainWindow;
let updateState={status:'idle',version:null,progress:0,error:null};

function backupDir(){return path.join(app.getPath('userData'),'backups')}
function createBackup(data){
  fs.mkdirSync(backupDir(),{recursive:true});
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');
  const file=path.join(backupDir(),`backup-${stamp}.json`);
  fs.writeFileSync(file,JSON.stringify({createdAt:new Date().toISOString(),appVersion:app.getVersion(),data},null,2),'utf8');
  const files=fs.readdirSync(backupDir()).sort().reverse();
  files.slice(10).forEach(f=>{try{fs.unlinkSync(path.join(backupDir(),f))}catch{}});
  return file;
}
function sendUpdate(event,payload={}){
  updateState={...updateState,...payload};
  if(mainWindow&&!mainWindow.isDestroyed()) mainWindow.webContents.send('update-status',updateState);
}
function setupUpdater(){
  autoUpdater.autoDownload=false;
  autoUpdater.autoInstallOnAppQuit=false;
  autoUpdater.on('checking-for-update',()=>sendUpdate('checking',{status:'checking',error:null}));
  autoUpdater.on('update-available',info=>sendUpdate('available',{status:'available',version:info.version,progress:0,error:null}));
  autoUpdater.on('update-not-available',info=>sendUpdate('latest',{status:'latest',version:info.version,error:null}));
  autoUpdater.on('download-progress',p=>sendUpdate('downloading',{status:'downloading',progress:Math.round(p.percent)}));
  autoUpdater.on('update-downloaded',info=>sendUpdate('downloaded',{status:'downloaded',version:info.version,progress:100,error:null}));
  autoUpdater.on('error',err=>sendUpdate('error',{status:'error',error:err?.message||String(err)}));
}
async function createWindow(){
  mainWindow=new BrowserWindow({width:1250,height:850,minWidth:1000,minHeight:650,webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false}});
  mainWindow.loadFile(path.join(__dirname,'index.html'));
}
app.whenReady().then(()=>{
  ipcMain.handle('app-version',()=>app.getVersion());
  ipcMain.handle('pick-image',async()=>{const r=await dialog.showOpenDialog({properties:['openFile'],filters:[{name:'Ảnh',extensions:['jpg','jpeg','png','webp']}]});return r.canceled?null:r.filePaths[0]});
  ipcMain.handle('backup-data',async(_,data)=>{try{return {ok:true,file:createBackup(data)}}catch(e){return {ok:false,error:e.message}}});
  ipcMain.handle('update-check',async()=>{try{await autoUpdater.checkForUpdates();return {ok:true}}catch(e){sendUpdate('error',{status:'error',error:e.message});return {ok:false,error:e.message}}});
  ipcMain.handle('update-download',async(_,data)=>{try{createBackup(data);await autoUpdater.downloadUpdate();return {ok:true}}catch(e){sendUpdate('error',{status:'error',error:e.message});return {ok:false,error:e.message}}});
  ipcMain.handle('update-install',async(_,data)=>{try{createBackup(data);setTimeout(()=>autoUpdater.quitAndInstall(false,true),250);return {ok:true}}catch(e){sendUpdate('error',{status:'error',error:e.message});return {ok:false,error:e.message}}});
  ipcMain.handle('open-backup-folder',async()=>{await shell.openPath(backupDir());return backupDir()});
  setupUpdater();
  createWindow();
  app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)createWindow()});
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
