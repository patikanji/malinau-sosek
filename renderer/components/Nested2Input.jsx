const Nested2Input = ({ value, disabled, model, nodes, setter, proxy, isNumber = false, style = '' }) => {
  const klas = "border focus:outline-none focus:border-blue-400 hover:border-blue-300 px-2 py-1"
  const steps = nodes.length

  return (
    <input type="text" disabled={disabled}
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
              [nodes[0]]: {
                ...prev[nodes[0]],
                [nodes[1]]: newVal
              }
            }))
          } else {
            setter(prev => ({
              ...prev,
              [nodes[0]]: {
                ...prev[nodes[0]],
                [nodes[1]]: null
              }
            }))
            e.target.value = ''
          }
        } else {
          setter(prev => ({
            ...prev,
            [nodes[0]]: {
              ...prev[nodes[0]],
              [nodes[1]]: val
            }
          }))
        }
      }}
      onBlur={e => {
        if (isNumber) {
          if (isNaN(e.target.value)) {
            e.target.value = ''
          }
        } else {
          e.target.value = model[nodes[0]][nodes[1]]
        }

        // Persisting only performs on blur
        proxy(prev => ({
          ...prev,
          [nodes[0]]: {
            ...prev[nodes[0]],
            [nodes[1]]: model[nodes[0]][nodes[1]]
          }
        }))
      }}
    />
  )
}

const Nested2Input_ORIGINAL = ({ value, model, nodes, setter, isNumber = false, style = '' }) => {
  const klas = "border focus:outline-none focus:border-blue-400 hover:border-blue-300 px-2 py-1"
  const steps = nodes.length

  return (
    <input type="text"
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
              [nodes[0]]: {
                ...prev[nodes[0]],
                [nodes[1]]: newVal
              }
            }))
          } else {
            setter(prev => ({
              ...prev,
              [nodes[0]]: {
                ...prev[nodes[0]],
                [nodes[1]]: null
              }
            }))
            e.target.value = ''
          }
        } else {
          setter(prev => ({
            ...prev,
            [nodes[0]]: {
              ...prev[nodes[0]],
              [nodes[1]]: val
            }
          }))
        }
      }}
      onBlur={e => {
        if (isNumber) {
          if (isNaN(e.target.value)) {
            e.target.value = ''
          }
        } else {
          e.target.value = model[nodes[0]][nodes[1]]
        }
      }}
    />
  )
}

export default Nested2Input