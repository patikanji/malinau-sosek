import electron from 'electron'
import { React, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { modelSosek } from '../lib/sosek'
import Layout from '../components/Layout'
import Hero from '../components/Hero'

// const { ipcRenderer } = require('electron')
const ipcRenderer = electron.ipcRenderer || false
const mainProcess = electron.remote || false
// const mainProcess = require('../../main/background.js')
let filePath = null

const Home = () => {
  const router = useRouter()
  const user = getUser()
  const [daftar, setDaftar] = useState(getDaftarResponden() || [])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const config = {
    title: 'Daftar Responden',
    back: '',
    next: '',
    footer: true,
    isHome: true,
    user: user,
    ribbon: 'Gunakan air, udara, dan lain-lain seperlunya... ',
  }

  function getUser() {
    if (ipcRenderer) {
      return ipcRenderer.sendSync('get-user')
    }
  }

  function getDaftarResponden() {
    if(ipcRenderer) {
      return ipcRenderer.sendSync('get-daftar-responden')
    }

    // return {}
    return []
  }

  useEffect(() => {
    // componentDidMount()
    if (ipcRenderer) {
      // setDaftar(ipcRenderer.sendSync('get-daftar-responden'))
      // ipcRenderer.on('get-daftar-responden', (event, data) => {
      //   setDaftar(data)
      // })
    }

    return () => {
      // componentWillUnmount()
      if (ipcRenderer) {
        // unregister it
        ipcRenderer.removeAllListeners('get-user')
        ipcRenderer.removeAllListeners('get-daftar-responden')
      }
    }
  }, [daftar])

  const createResponden = () => {
    if (ipcRenderer) {
      let model = modelSosek
      model.nama = 'Bambu Sinam'
      const response = ipcRenderer.sendSync('save-responden', model)
      console.log('Responden:', response)

      if(response) setResponden(response)
    }
  }

  const editResponden = (e) => {
    router.push(`/responden?id=${e.target.value}`)
  }

  const deleteHandler = () => {
    const id = selectedId
    if (id) {
      // const response = ipcRenderer.sendSync('delete-responden', id)
      const response = ipcRenderer.send('delete-responden', id)
      setDaftar(response)
    }
    setSelectedId(null)
    setShowDeleteDialog(false)
  }

  const btnDeleteHandler = (e) => {
    const v = e.target.value
    setSelectedId(v)
    setShowDeleteDialog(true)
  }

  const download = () => {
    // if (mainProcess) {
    //   console.log('Found mainProcess')
    //   const currentWindow = ipcMain.getCurrentWindow()
    //   const content = JSON.stringify(daftar, null, 2)
    //   ipcMain.saveData(currentWindow, filePath, content)
    // }

    // console.log('mainProcess not found')
    if (ipcRenderer) {
      const response = ipcRenderer.sendSync('save-data', 'test')
      console.log(response)
    }
  }

  return (
    <Layout config={config}>
      <Hero title={config.title} ribbon={config.ribbon} />
      <table className="w-full border-t border-gray-400 text-xs">
        <tbody>
          <tr className="text-right text-gray-400 border-b border-gray-200 bg-gray-100">
            <th className="w-12 p-2 pl-6">#</th>
            <th className="w-48 text-left font-normal p-2">ID Responden</th>
            <th className="text-left font-normal p-2">Tanggal</th>
            <th className="text-left font-normal p-2">Desa</th>
            <th className="text-left font-normal p-2">Nama Responden (KK)</th>
            <th className="w-36 text-left font-normal p-2">Action</th>
          </tr>
        </tbody>
        <tbody>
        {daftar?.map((res, index) => (
          <tr key={res.id} className="border-b hover:bg-white whitespace-nowrap">
            <td className="w-12 p-2 pl-6 text-right">{index + 1}</td>
            <td className="font-mono p-2">{res.id}</td>
            <td className="p-2">{res.tanggal}</td>
            <td className="p-2">{res.desa}</td>
            <td className="p-2">{res.nama}</td>
            <td className="text-xs text-gray-400 p-2">
              <button value={res.id}
              className="rounded-sm hover:text-gray-500 hover:bg-gray-200 px-2 py-1 focus:outline-none -ml-2"
              >View</button>
              <button value={res.id} onClick={editResponden}
              className="rounded-sm hover:text-purple-500 hover:bg-purple-200 px-2 py-1 focus:outline-none"
              >Edit</button>
              <button value={res.id} onClick={btnDeleteHandler}
              className="rounded-sm hover:text-red-500 hover:bg-red-200 px-2 py-1 focus:outline-none"
              >Del</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      <div className="py-10 text-center">
        <button onClick={download} className="border hover:border-gray-300 px-4 py-2 hover:shadow">
          Save Data
        </button>
      </div>

      {showDeleteDialog && <div className="fixed w-full h-full top-0 bg-gray-400 bg-opacity-50 flex flex-wrap content-center ">
        <div className="relative w-auto rounded h-auto mx-auto bg-white px-8 py-4 shadow-lg text-center">
          <p>Yakin mau menghapus?</p>
          <p className="text-xs text-red-600">(Tidak bisa UNDO)</p>
          <div className="bg-gray-600 text-white text-center -mx-8 px-6 py-2 my-4">
            <p className="text-sm text-gray-400 font-mono">{selectedId}</p>
            <p className="text-yellow-300 text-2xl font-bold">{daftar[selectedId]}</p>
          </div>
          <button onClick={e => {
            setShowDeleteDialog(false)
            setSelectedId(null)
          }}
            className="rounded text-sm text-gray-200 focus:text-white font-bold bg-gray-500 hover:bg-gray-600 focus:bg-gray-700 focus:outline-none px-6 py-2"
          >Cancel</button>
          <button onClick={deleteHandler}
            className="rounded text-sm text-gray-200 focus:text-white font-bold bg-red-500 hover:bg-red-600 focus:bg-red-700 focus:outline-none px-6 py-2 ml-4"
          >Hapus</button>
        </div>
      </div>}

      {/* <pre className="my-10 p-8">{JSON.stringify(daftar, null, 2)}</pre> */}
    </Layout>
  )
}

export default Home


/*

const Home = () => {
  const [user, setUser] = useState(null)
  const [dataDir, setDataDir] = useState(null)
  const [daftar, setDaftar] = useState(null)

  useEffect(() => {
    if (ipcRenderer) {
      setUser(ipcRenderer.sendSync('get-user'))
      setDataDir(ipcRenderer.sendSync('get-data-dir'))
      setDaftar(ipcRenderer.sendSync('get-daftar-responden'))
    }
  })
  const [dataDirSync, setDataDirSync] = useState(null)

  // useEffect(() => {
  //   setDataDir( ipcRenderer.send('get-data-dir', 'MSG from ipcRenderer') )
  //   setDataDirSync( ipcRenderer.sendSync('get-data-dir-sync', 'MSG from ipcRenderer') )
  // })


  const onClickWithIpc = () => {
    if (ipcRenderer) {
      const response = ipcRenderer.send('get-data-dir', 'some data from ipcRenderer');
      console.log(response)
    }
  }

  const onClickWithIpcSync = () => {
    if (ipcRenderer) {
      const response = ipcRenderer.sendSync('get-data-dir-sync');
      console.log(response)
    }
  }

  return (
    <>
      <div>
        <div className='grid grid-col-1 text-2xl w-full text-center'>
          <img className='ml-auto mr-auto' src='/images/logo.png' />
          <span>⚡ Electron ⚡</span>
          <span>+</span>
          <span>User: {user}</span>
          <span>+</span>
          <span>DataDir: {dataDir}</span>
          <span>=</span>
          <span>Daftar: </span>
        </div>
        <div className='mt-1 w-full flex-wrap flex justify-center'>
          <Link href='/home'>
            <a className='btn-blue'>Go to home page</a>
          </Link>
        </div>
      </div>
    </>
  )
}

*/