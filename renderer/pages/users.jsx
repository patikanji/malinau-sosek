import electron from 'electron'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const ipcRenderer = electron.ipcRenderer || false
// const daftarResponden = ipcRenderer.sendSync('get-daftar-responden') || {}

const messages = [
  'password keliru',
  'password salah',
  'kurang tepat',
  'nyaris benar',
  'apakah anda lupa?',
  'coba diingat lagi',
  'waduh, keliru',
  'alamak...',
  'jinguk salah',
  'abrakadabra',
  'hakuna matata',
  'rubal biroma (salah)',
  'jangan malas',
  'butuh kopi?',
  'perlu paramex?',
  'lupa mencatat',
  'lupa dipelihara',
  'segera ke dokter',
  'buka catatan',
  'hemm...',
  'unforgettable?',
  'pantun pelupa',
  'toyota kijang',
  'lan kum bang',
  'ra lomba',
  'la romba',
  'password tai kuda',
  'tas bibir kod lod',
  'mending renang',
  'sebelah kiri...',
  'dikit lagi',
  'yak, coba lagi',
]

function getMessage() {
  const m = messages[Math.floor(Math.random() * messages.length)]
  return new Date().getTime() + ' - ' + m
}

const Page = () => {
  const router = useRouter()
  // const daftarResponden = ipcRenderer.sendSync('get-daftar-responden') || {}
  // const [daftarResponden, setDaftarResponden] = useState(ipcRenderer.sendSync('get-daftar-responden') || {})
  const [daftarResponden, setDaftarResponden] = useState({})
  const [password, setPassword] = useState('harM0er')
  const [message, setMessage] = useState('')
  const klas = "w-full bg-white text-gray-600 font-semibold mb-4 border-2 border-transparent hover:shadow-md focus:shadow-lg focus:outline-none text-xl px-3 py-1"

  useEffect(() => {
    setDaftarResponden(ipcRenderer.sendSync('get-daftar-responden'))
  }, [password])

  function handleSubmit(e) {
    e.preventDefault()
    if (ipcRenderer) {
      console.log('Verify password...')
      const response = ipcRenderer.sendSync('verify-password', password)
      console.log('Response:', response)
      if (response) {
        const daftar = Object.keys(daftarResponden).length
        const dest = daftar > 0 ? '/home' : '/firstlogin'
        router.push(dest)
      } else {
        setMessage(getMessage())
      }
    }
  }

  return (
    <div>
      <Head>
        <title>Sosek Mentarang - Password</title>
        {/* <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline';"/> */}
        {/* <meta httpEquiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'"/> */}
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-eval';"/>
      </Head>
      <div className="fixed w-full antialiased top-0 bottom-0 bg-gray-600">
        <div className="antialiased text-sm text-gray-700">
          <div className="flex flex-row items-center bg-gray-800 px-4 py-2">
            <div className="flex-grow">
              <h1 className="text-lg text-gray-500">Sosek Mentarang</h1>
            </div>
            <div className="flex-0 text-xs">
              <p className="text-gray-400 font-ssemibold uppercase"></p>
            </div>
          </div>
        </div>
        <div className="w-80 mx-auto my-20 sbg-gray-200 text-gray-300">
          <form onSubmit={handleSubmit}>
            <p className="mb-6">
              Masukkan <span className="font-bold text-white">password</span>{` `}
              untuk menggunakan aplikasi ini.
            </p>
            <p>
              <input type="password" placeholder="..." value={password}
              className={klas}
              onFocus={e => setMessage('')}
              onChange={e => {
                const val = e.target.value
                setPassword(val)
              }}
              />
            </p>
            <p className="text-xl text-gray-600 ">
              <button className="w-full border-2 border-transparent bg-gray-400 font-bold py-2 focus:outline-none hover:bg-gray-500 hover:text-gray-300 focus:bg-gray-700"
              onClick={e => {}}
              >Masuk</button>
            </p>
          </form>
          {message && <div className="rounded-full bg-gray-800 text-xs text-center text-red-500 font-mono uppercase px-2 py-1 mt-3">{message}</div>}
          <pre className="text-sm text-white my-3">tmaran | {password}</pre>
          <br/>
          <pre className="text-sm text-white my-3">{JSON.stringify(daftarResponden,null,0)}</pre>
        </div>
      </div>
    </div>
  )
}

export default Page