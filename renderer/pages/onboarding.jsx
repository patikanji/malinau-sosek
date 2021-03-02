import electron from 'electron'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/Header'

const ipcRenderer = electron.ipcRenderer || false

const Onboarding = () => {
  const title = 'Sosek Mentarang'
  const [userCreated, setUserCreated] = useState(null)
  const [user, setUser] = useState(false)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
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
        router.push('/tryout')
      }
    }
  }

  return (
    <>
      <div className="fixed w-full antialiased top-0 bottom-0 bg-gray-600">
        <Header title={title} user={user}/>
        <div className="flex top-0 items-center justify-center w-full h-full px-10 pt-10 pb-20">
          <div className="w-80 mx-auto sbg-gray-200 text-gray-300 pb-8">
            <h1 className="text-5xl text-center font-bold text-gray-500 -mt-10 mr-2 mb-6">Onboarding</h1>
            <form onSubmit={user ? handleLogin : handleSubmit}>
              {!user && <p className="text-sm text-center text-yellow-300 -mx-10 mb-8">
                Nama lengkap  <span className="font-bold text-yellow-600">tidak bisa diubah</span>{` `}
                dan akan dicantumkan sebagai nama enumerator dalam setiap data Sosek.{` `}
                Panjang password minimal enam karakter.
              </p>}
              {user && (
                <p className="text-sm text-center text-yellow-300 -mx-10 mb-8">
                Onboarding berhasil. Silakan memasukkan password untuk mulai{` `}
                menggunakan aplikasi Sosek Mentarang.
              </p>
              )}
              <p>
                {!user && <input type="text" placeholder="Nama Lengkap"
                value={name}
                className="w-full bg-white text-gray-600 font-semibold mb-4 border-2 border-transparent hover:shadow-md focus:shadow-lg focus:outline-none text-xl px-3 py-1"
                onChange={e => {
                  const val = e.target.value
                  setName(val)
                }}
                onBlur={e => {
                  const clean = e.target.value.replace(/\s+/g,' ').trim()
                  setName(clean)
                }}
                />}
                {user && <input disabled type="text" value={user.name}
                  className="w-full bg-gray-400 text-gray-600 font-semibold mb-4 border-2 border-transparent hover:shadow-md focus:shadow-lg focus:outline-none text-xl px-3 py-1"
                />}
              </p>
              <p>
                <input type="password" placeholder="Password" className={klas} value={password}
                onChange={e => {
                  const val = e.target.value
                  setPassword(val)
                }}
                />
              </p>
              {!user && !isReady() && (
              <p className="h-10 text-xl text-gray-600">
                <button disabled className="w-full h-full border-2 border-gray-700 text-gray-700 font-bold">Save</button>
              </p>
              )}
              {!user && isReady() && (
              <p className="h-10 text-xl text-gray-600">
                <button className="w-full h-full border-2 border-transparent bg-gray-400 font-bold hover:shadow-lg focus:outline-none hover:bg-gray-500 hover:text-gray-300 focus:bg-gray-700"
                onClick={e => {}}
                >Save</button>
              </p>
              )}
              {user && (
                <p className="h-10 text-xl text-gray-600">
                <button className="w-full h-full border-2 border-transparent bg-yellow-400 font-bold focus:outline-none hover:shadow-lg hover:bg-yellow-300 hover:text-gray-700 focus:bg-yellow-500"
                onClick={e => {}}
                >Masuk</button>
              </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Onboarding