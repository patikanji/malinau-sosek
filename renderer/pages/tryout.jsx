import electron from 'electron'
import Layout from "../components/Layout"
import { useState, useEffect } from 'react'
import { dfBulan, dfTanggal, modelSosek } from '../lib/sosek'
import { useRouter } from 'next/router'

const ipcRenderer = electron.ipcRenderer || false

const Page = () => {
  const router = useRouter()
  const user = getUser()
  const [tanggal, setTanggal] = useState('')
  const [bulan, setBulan] = useState('')
  const [model, setModel] = useState({
    nama: '',
    tanggal: '',
    dusun: '',
    desa: '',
    kecamatan: '',
  })

  const config = {
    title: 'Test Sampel Responden',
    back: '',
    next: '',
    footer: false,
    user: getUser(),
    ribbon: 'Klik cancel untuk membatalkan',
  }

  function getUser() {
    if(ipcRenderer) {
      return ipcRenderer.sendSync('get-user')
    }

    return false
  }


  useEffect(() => {
    setModel(prev => ({
      ...prev,
      tanggal: `2021-${bulan}-${tanggal}`
    }))
  }, [bulan, tanggal])

  function verified() {
    return model.nama.length > 2 && model.desa.length > 2 && bulan.length == 2 && tanggal.length == 2
  }

  function handleSubmit() {
    console.log('Model', model)
    let responden = modelSosek
    responden.enumerator = user.name
    responden.nama = model.nama
    responden.tanggal = model.tanggal
    responden.dusun = model.dusun
    responden.desa = model.desa
    responden.kecamatan = model.kecamatan

    console.log(responden)

    const response = ipcRenderer.sendSync('save-responden', responden)
    console.log('Response', response)
    // if (response.id) {
      router.push('/home')
    // }
  }

  return (
    <Layout config={config}>
      <div className="w-4/6 mx-auto bg-gray-s200 my-12 p-4">
        <div className="mb-6 border-b-2 border-gray-300 pb-3">
          <h1 className="text-xl font-bold">Masukkan data singkat responden</h1>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td width="165">Nama&nbsp;Enumerator:</td>
              <td className="py-1">
                <input type="text" disabled value={user.name}
                  className="w-full border focus:outline-none focus:border-blue-400 hover:border-blue-300 px-2 py-1"
                />
              </td>
            </tr>
            <tr>
              <td width="165">Nama&nbsp;Responden:</td>
              <td className="py-1">
              <Input model={model} setter={setModel} field="nama"/>
              </td>
            </tr>
            <tr>
              <td>Tanggal&nbsp;Wawancara:&nbsp;</td>
              <td className="py-1">
                <select value={tanggal}
                onChange={e => { setTanggal(e.target.value) }}
                className="border hover:border-purple-300 focus:border-purple-500 focus:outline-none px-2 py-1 mr-3">
                  <option value="0">-</option>
                  {dfTanggal.map((t) => (
                    <option key={t} value={t}>{parseInt(t)}</option>
                  ))}
                </select>
                <select value={bulan}
                onChange={e => { setBulan(e.target.value) }}
                className="border hover:border-purple-300 focus:border-purple-500 focus:outline-none px-2 py-1 mr-3">
                  <option value="0">-</option>
                  {dfBulan.map(([val, text]) => (
                    <option key={text} value={val}>{text}</option>
                  ))}
                </select>
                <select disabled className="border bg-gray-100 px-2 py-1 mr-3">
                  <option>2021</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Dusun:</td>
              <td className="py-1">
              <Input model={model} setter={setModel} field="dusun"/>
              </td>
            </tr>
            <tr>
              <td>Desa:</td>
              <td className="py-1">
              <Input model={model} setter={setModel} field="desa"/>
              </td>
            </tr>
            <tr>
              <td>Kecamatan:</td>
              <td className="py-1">
                <Input model={model} setter={setModel} field="kecamatan"/>
              </td>
            </tr>

            <tr>
              <td colSpan="2" className="px-0 py-3">
                <div className="rounded bg-gray-100 text-center text-xs text-gray-500 p-3">
                Kolom nama, tanggal-bulan, dan desa harus terisi.{` `}
                Mohon mengisi dengan penulisan ejaan yang benar.
                </div>
              </td>
            </tr>

            <tr>
              <td className="py-2 pr-3">
                {/* <button
                className="w-full text-gray-500 font-semibold hover:shadow border border-gray-300 py-3 hover:bg-white focus:outline-none focus:bg-gray-400s focus:border-purple-400"
                >Cancel</button> */}
              </td>
              <td className="py-1">
              {!verified() && <button disabled
                className="w-full text-gray-300 font-semibold border border-gray-200 py-3 "
                >Save</button>}
                {verified() && <button onClick={handleSubmit}
                className="w-full text-gray-500 font-semibold hover:shadow border border-gray-300 py-3 hover:bg-white focus:outline-none focus:bg-gray-400s focus:border-purple-400"
                >Save Responden</button>}
              </td>
            </tr>
          </tbody>
        </table>
        {/* <pre className="text-xs my-4">{JSON.stringify(model, null, 2)}</pre> */}
      </div>



    </Layout>
  )
}

export default Page


function Input({ model, setter, field }) {
  return (
    <input type="text" value={model[field]}
    onChange={e => {
      setter(m => ({
        ...m,
        [field]: e.target.value
      }))
    }}
    className="w-full border hover:border-purple-300 focus:border-purple-500 focus:outline-none  px-3 py-1"
    />
  )
}