import electron from 'electron'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/Header'

const ipcRenderer = electron.ipcRenderer || false

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

const Onboarding = () => {
  const title = 'Sosek Mentarang'
  const [userCreated, setUserCreated] = useState(null)
  const [user, setUser] = useState(false)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const klas = "w-full bg-white text-gray-600 font-semibold mb-4 border-2 border-transparent hover:shadow-md focus:shadow-lg focus:outline-none text-xl px-3 py-1"

  useEffect(() => {
    // componentDidMount()
    if (ipcRenderer) {
      setUser(ipcRenderer.sendSync('get-user'))
    }

    return () => {
      // componentWillUnmount()
      if (ipcRenderer) {
        // unregister it
        ipcRenderer.removeAllListeners('ping-pong');
      }
    }
  }, [])

  function isReady() {
    // remove extra spaces
    const n = name.replace(/\s+/g,' ').trim()
    const p = password.replace(/\s+/g,' ').trim()
    return n.length > 5 && p.length > 5
  }

  function handleSubmit(e) {
    e.preventDefault()

    const newUser = {
      name: name.replace(/\s+/g,' ').trim(),
      password: password.replace(/\s+/g,' ').trim()
    }

    if (ipcRenderer) {
      console.log('Using [ipcRenderer]...')
      const response = ipcRenderer.sendSync('create-user', newUser)
      console.log('Response:', response)
      // router.push('/user')
      if (response) {
        setUser(response)
        setPassword('')
      }
    }
  }

  function handleLogin(e) {
    e.preventDefault()
    if (ipcRenderer) {
      const response = ipcRenderer.sendSync('verify-password', password)
      if (response) {
        // router.push('/home')
        router.push('/home')
      } else {
        setMessage(getMessage())
      }
    }
  }

  return (
    <>
      <div className="fixed w-full antialiased top-0 bottom-0 bg-gray-600">
        <Header title={title} user={user}/>
        <div className="flex top-0 items-center justify-center w-full h-full px-10 pt-10 pb-20">
          <div className="w-80 mx-auto sbg-gray-200 text-gray-300 pb-8">
            <h1 className="text-5xl text-center font-bold text-gray-500 -mt-10 mr-2 mb-6">Login Sosek</h1>
            <form onSubmit={user ? handleLogin : handleSubmit}>
              <p className="text-sm text-center text-yellow-300 -mx-10 mb-8">
                Silakan memasukkan password Anda untuk mulai{` `}
                menggunakan aplikasi Sosek Mentarang.
              </p>
              <p>
                <input disabled type="text" value={user.name}
                  className="w-full bg-gray-400 text-gray-600 font-semibold mb-4 border-2 border-transparent hover:shadow-md focus:shadow-lg focus:outline-none text-xl px-3 py-1"
                />
              </p>
              <p>
                <input type="password" placeholder="Password" className={klas} value={password}
                onChange={e => {
                  const val = e.target.value
                  setPassword(val)
                }}
                />
              </p>
              <p className="h-10 text-xl text-gray-600">
                <button className="w-full h-full border-2 border-transparent bg-yellow-400 font-bold focus:outline-none hover:shadow-lg hover:bg-yellow-300 hover:text-gray-700 focus:bg-yellow-500"
                onClick={e => {}}
                >Masuk</button>
              </p>
            </form>
            {!message && <p className="rounded-full text-xs text-center text-red-500 font-mono my-8 -mx-10 px-3 py-2">
              &nbsp;
            </p>}
            {message && <p className="rounded-full bg-gray-800 text-xs text-center uppercase text-red-500 font-mono my-8 -mx-10 px-3 py-2">
              {message}
            </p>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Onboarding