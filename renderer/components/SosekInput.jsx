const SosekInput = ({ id, model, field, setter, width, disabled=false, autofous = false }) => {
  const klas = "border focus:outline-none focus:border-blue-400 hover:border-blue-300 px-2 py-1"
  const name = 'sosek-input-' + new Date().getTime()
  return (
    <input type="text" autoComplete={false} name={name}
      id={id}
      disabled={disabled}
      autoFocus={autofous}
      value={model[field]}
      className={`${klas} ${width}`}
      onChange={e => {
        const val = e.target.value
        setter (prev => ({
          ...prev, [field]: val
        }))
      }}
    />
  )
}

export default SosekInput