import { app, ipcMain, dialog } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import * as Store from 'electron-store'
import passwordCrypt from '../renderer/lib/crypt'
import { newJsonID } from '../renderer/lib/utils'

const fs = require('fs')
const path = require('path')

const isProd = process.env.NODE_ENV === 'production';
const tmpRoute = 'home'

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}


(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 800, //1000,
    height: 600, // 600
    minWidth: 640,
    minHeight: 600,
    maxWidth: 1000,
  });

  const isUser = store.get('user')
  // const route = tmpRoute ? tmpRoute : (isUser ? 'user' : 'onboarding')
  const route = isUser ? 'user' : 'onboarding'

  if (isProd) {
    await mainWindow.loadURL(`app://./${route}.html`);
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/${route}`);
    // mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

/* ===================== */

const DATADIR = path.join(app.getPath('userData'), 'JSONSosekFiles')
if (!fs.existsSync(DATADIR)) fs.mkdirSync(DATADIR)

const DOCUMENTSDIR = app.getPath('documents')

/* Malinau store */

const name = isProd ? 'malinau-sosek' : 'malinau-sosek-dev'
const store = new Store({ name: name })


const getAllRespondenData = () => {
  const files = store.get('files')
  let daftar = []
  Object.keys(files).forEach((key) => {
    const file = path.join(DATADIR, key)
    const buff = fs.readFileSync(file, 'utf-8')
    const json = JSON.parse(buff)
    // daftar[key] = json
    // daftar.push({ id: json.id, tanggal: json.tanggal, desa: json.desa, nama: json.nama })
    daftar.push(json)
  })

  return daftar
}

/* All synchronous channels */

ipcMain.on('get-data-dir', (event, arg) => {
  // event.returnValue = `[ipcMain] "${arg}" received synchronously.`
  event.returnValue = DATADIR
})

ipcMain.on('get-user', (event, arg) => {
  event.returnValue = store.get('user') || false
})

ipcMain.on('create-user', (event, arg) => {
  const user = store.get('user')

  if (!user) {
    const { name, password } = arg
    const hashed = passwordCrypt(password)
    store.set('user', { name: name, password: hashed })
    event.returnValue = store.get('user') || {}
  }

  event.returnValue = false
})

ipcMain.on('verify-password', (event, arg) => {
  const hashed = passwordCrypt(arg)
  const user = store.get('user')
  event.returnValue = hashed === user.password
})

// Channel responden

ipcMain.on('get-responden', (event, arg) => {
  const file = path.join(DATADIR, arg)
  const buff = fs.readFileSync(file, 'utf-8')
  event.returnValue = JSON.parse(buff)
})

ipcMain.on('get-daftar-responden', (event, arg) => {
  // event.returnValue = store.get('files') || {};

  const files = store.get('files')
  let daftar = []
  Object.keys(files).forEach((key) => {
    const file = path.join(DATADIR, key)
    const buff = fs.readFileSync(file, 'utf-8')
    const json = JSON.parse(buff)
    // daftar[key] = json
    daftar.push({ id: json.id, tanggal: json.tanggal, desa: json.desa, nama: json.nama })
  })

  console.log(daftar)
  event.returnValue = daftar
})

ipcMain.on('save-responden', (event, arg) => {
  let responden = arg
  let prefix = arg.id ? 'SAVED: ' : 'CREATED NEW RESPONDEN: '
  if (!responden.id) responden.id = newJsonID()
  const key = `files.${responden.id}`
  const filePath = path.join(DATADIR, responden.id)

  const anggota = {
    nama: responden.nama,
    gender: responden.gender,
    umur: responden.umur,
    hubungan: responden.hubungan,
    marital: responden.marital,
    kerentanan: responden.kerentanan,
    pendidikan: responden.pendidikan,
    pekerjaan: responden.pekerjaan,
  }

  if (responden.anggota.length > 0) {
    responden.anggota[0] = anggota
  } else {
    responden.anggota.push(anggota)
  }

  const data = JSON.stringify(responden, null, 0)
  fs.writeFile(filePath, data, { overwrite: true }, function(err) {
    if (err) throw err

    console.log(prefix, responden.id)
    store.set(key, responden.nama)
  })

  event.returnValue = responden
})

ipcMain.on('delete-responden', (event, arg) => {
  const key = 'files.' + arg
  const file = path.join(DATADIR, arg)
  fs.unlink(file, function(err) {
    if (err) {
      event.returnValue = 'Failed to delete responden.'
    }
    store.delete(key)
    event.returnValue = store.get('files') || {};
  })
})

ipcMain.on('save-data', (event, arg) => {
  const username = store.get('user').name.split(' ').join('').toUpperCase()
  const date = new Date().toISOString().replaceAll(':', '').substr(0, 17)
  const filename = 'SOSEK-' + username + '-' + date
  const filePath = path.join(DOCUMENTSDIR, filename)
  const data = JSON.stringify(getAllRespondenData(), null, 2)
  fs.writeFile(filePath, data, { overwrite: true }, function(err) {
    if (err) {
      event.returnValue = 'Failed to save data.'
    }

    event.returnValue = 'Saved as ' + filePath
  })
})

/**
 *
 *
 *
 *
 *
 *
 */

const saveData = exports.saveData = (targetWindow, file, content) => {
  if (!file) {
    file = dialog.showSaveDialog(targetWindow, {
      title: 'Save Sosek Data',
      defaultPath: app.getPath('documents'),
      filters: [
        { name: 'Sosek JSON File', extensions: ['sjf']}
      ]
    })
  }

  if (!file) return

  fs.writeFile(file, content)
}