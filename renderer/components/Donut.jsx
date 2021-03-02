import { useState } from 'react'

const Donut = ({ text, alt, handler }) => {
  const [state, setState] = useState(false)
  const t1 = text ? text : 'Lock'
  const t2 = alt ? alt : 'Unlock'
  return (
    <span className="inline-block">
    <button
    onClick={e => {
      setState(!state)
      if (typeof handler === 'function') handler()
    }}
    className="flex flex-row items-center focus:outline-none text-red-600 leading-none pt-1 hover:text-purple-500">
      {state && <div className="text-lg mx-2">🍩</div>}
      {!state && <div className="text-lg mx-2">🍪</div>}
      {text && alt && <div className="font-bold- pr-2">{state ? text : alt}</div>}
      {text && !alt && <div className="font-bold- pr-2">{text}</div>}
    </button>
    </span>
  )
}

export default Donut