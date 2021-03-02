const Nested2Select = ({ options, model, nodes, setter, disabled }) => {
  return (
    <select disabled={disabled}
    className="border pl-1 pr-3 py-1 focus:border-blue-400 focus:outline-none"
    defaultValue={model[nodes[0]][nodes[1]]}
    onChange={e => {
        const val = e.target.value
        setter (prev => ({
          ...prev,
          [nodes[0]]: {
            ...prev[nodes[0]],
            [nodes[1]]: val
          }
        }))
      }}
    >
      <option></option>
      {options.map(([v, t]) => (
        <option key={v} value={v}>{t}</option>
      ))}
    </select>
  )
}

export default Nested2Select