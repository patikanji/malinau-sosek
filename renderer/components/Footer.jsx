import { useRouter } from 'next/router'

const Footer = ({ back, next, isHome = false }) => {
  const router = useRouter()
  const normal   = "h-full px-4 hover:bg-gray-600 focus:outline-none"
  const disabled = `${normal} opacity-50`

  return (
    <div className="footer fixed w-full bottom-0 bg-gray-900 pt-px bg-opacity-20">
      <div className="flex flex-row bg-gray-500 h-12 antialiased">
        <div className="flex flex-row flex-grow items-center text-2xl">
          <button onClick={e => router.push('/home')}
          className={`${normal} border-r border-gray-700 border-opacity-20`}>🍺</button>

            {isHome && (
              <>
                <button onClick={e => router.push('/new')} className={`flex flex-row items-center border-r border-gray-700 border-opacity-20 hover:text-gray-400 pr-6 ${normal}`}>
                  <span>🧺</span>
                  <span className="inline-block text-base opacity-50 ml-3">New</span>
                </button>
                <button onClick={e => router.push('/user')} className={`${normal} border-r border-gray-700 border-opacity-20`}>☕️</button>
              </>
            )}

          <div className="flex-grow text-sm text-center text-gray-400 px-4">
            Nosing mbus-mbussu jinggo tanting yu ngit-ngit
          </div>
        </div>
        {!isHome && (
          <div className="flex flex-row items-center text-2xl text-gray-600">
            {!back && <button disabled className={`${disabled} flip-h border-r border-gray-700 border-opacity-20`}>🥾</button>}
            {back && <button onClick={e => router.push(back)} className={`${normal} flip-h border-r border-gray-700 border-opacity-20`}>🥾</button>}
            {!next && <button disabled className={`${disabled} border-l`}>🥾</button>}
            {next && <button onClick={e => router.push(next)} className={`${normal} border-l border-gray-700 border-opacity-20`}>🥾</button>}
          </div>
        )}
      </div>
      <style jsx>{`
      .flip-h {
        transform: scale(-1, 1);
      }
      `}</style>
    </div>
  )
}

export default Footer


// border-r border-gray-600