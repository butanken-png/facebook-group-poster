const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('desktop',{
  getAppVersion:()=>ipcRenderer.invoke('app-version'),
  pickImage:()=>ipcRenderer.invoke('pick-image'),
  backupData:data=>ipcRenderer.invoke('backup-data',data),
  checkForUpdates:()=>ipcRenderer.invoke('update-check'),
  downloadUpdate:data=>ipcRenderer.invoke('update-download',data),
  installUpdate:data=>ipcRenderer.invoke('update-install',data),
  openBackupFolder:()=>ipcRenderer.invoke('open-backup-folder'),
  onUpdateStatus:fn=>ipcRenderer.on('update-status',(_,data)=>fn(data))
});
