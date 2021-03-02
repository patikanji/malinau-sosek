const NestedInput = ({
  value,
  model,
  nodes,
  setter,
  proxy=null,
  disabled=false,
  id='',
  isNumber=false,
  autofocus=false,
  style=''
}) => {
  const klas = "border focus:outline-none focus:border-blue-400 hover:border-blue-300 px-2 py-1"

  return (
    <input type="text"
      id={id}
      disabled={disabled}
      autoFocus={autofocus}
      className={`${klas} ${style}`}
      value={value}
      onChange={e => {
        const val = e.target.value

        if (isNumber) {
          const regex = new RegExp(`^[0-9]*$`)
          if (regex.test(val)) {
            const newVal = parseInt(val)
            setter(prev => ({
              ...prev,
              [nodes[0]]: newVal
            }))
          } else {
            setter(prev => ({
              ...prev,
              [nodes[0]]: null
            }))
            e.target.value = ''
          }
        } else {
          setter(prev => ({
            ...prev,
            [nodes[0]]: val
          }))
        }
      }}
      onBlur={e => {
        if (isNumber) {
          if (isNaN(e.target.value)) {
            e.target.value = ''
          } else {
            e.target.value = model[nodes[0]]
          }
        } else {
          e.target.value = model[nodes[0]]
        }

        // Update proxy on blue
        if (proxy) {
          proxy(prev => ({
            ...prev,
            [nodes[0]]: model[nodes[0]]
          }))
        }
      }}
    />
  )
}

export default NestedInput