const Select = ({ options, model, field, setter, optionType="kv", disabled=false }) => {
  // optionType kv => [[k,v], [k,v], ...]
  // optionType v => [v, v, v, ...]

  if (optionType !== "kv") return (
    <select
    disabled={disabled}
    className="border pl-1 pr-3 py-1 focus:border-blue-400 focus:outline-none"
    defaultValue={model[field]}
    onChange={e => {
        const val = e.target.value
        setter (prev => ({
          ...prev, [field]: val
        }))
      }}
    >
      <option></option>
      {options.map((v) => (
        <option key={v} value={v}>{v}</option>
      ))}
    </select>
  )

  return (
    <select
    disabled={disabled}
    className="border pl-1 pr-3 py-1 focus:border-blue-400 focus:outline-none"
    defaultValue={model[field]}
    onChange={e => {
        const val = e.target.value
        setter (prev => ({
          ...prev, [field]: val
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

export default Select