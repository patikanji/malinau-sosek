import electron from 'electron'
import Layout from "../components/Layout"
import { useState, useEffect } from 'react'
import Section from "../components/Section"
import { useRouter } from 'next/router'
import { modelSosek, modelAnggota, dfTanggal, dfBulan, dfGender, dfHubungan, dfRentan, dfStatus, dfAgama, dfPendidikan, dfPekerjaan, dfMukim } from '../lib/sosek'
import Hero from '../components/Hero'
import Input from '../components/Input'
import Select from '../components/Select'

const ipcRenderer = electron.ipcRenderer || false

const leftContents = [
  // ['tanggal', 'Tanggal wawancara'],
  ['nama', 'Nama responden'],
  ['dusun', 'Dusun'],
  ['desa', 'Desa'],
  ['kecamatan', 'Kecamatan'],
  ['umur', 'Umur'],
  ['suku', 'Etnis / suku'],
  ['bahasa', 'Bahasa sehari-hari'],
]

const rightContents = [
  ['gender', 'Jenis kelamin', dfGender],
  ['hubungan', 'Hubungan keluarga', dfHubungan],
  ['marital', 'Status perkawinan', dfStatus],
  ['agama', 'Agama', dfAgama],
  ['pendidikan', 'Pendidikan', dfPendidikan],
  ['pekerjaan', 'Pekerjaan utama', dfPekerjaan],
  ['mukim', 'Lama mukim', dfMukim],
  ['kerentanan', 'Kerentanan', dfRentan],
]





const Page = () => {
  const user = getUser()
  const [sosekData, setSosekData] = useState(newModel())
  const [sosekCopy, setSosekCopy] = useState(newModel())

  let config = {
    title: 'New Responden',
    back: '',
    next: '',
    footer: true,
    user: getUser(),
    ribbon: 'masukkan data dengan ejaan yang benar',
  }

  function newModel() {
    let model = modelSosek
    model.enumerator = user.name
    return model
  }

  function getUser() {
    if(ipcRenderer) {
      return ipcRenderer.sendSync('get-user')
    }

    return false
  }

  function getDataDir() {
    if (ipcRenderer) {
      return ipcRenderer.sendSync('get-data-dir')
    }

    return false
  }

  return (
    <Layout config={config}>
      <Hero title={config.title} ribbon={config.ribbon} />
      <Section text={'Profil Responden'} />
      <NewProfile model={sosekCopy} setter={setSosekCopy} proxy={setSosekData} />
    </Layout>
  )
}

export default Page


const NewProfile = ({ model, setter, proxy }) => {
  const router = useRouter()
  const [tanggal, setTanggal] = useState('')
  const [bulan, setBulan] = useState('')
  const [kerentanan, setKerentanan] = useState('')

  useEffect(() => {
    setter(prev => ({
      ...prev,
      tanggal: `2021-${bulan}-${tanggal}`
    }))
  }, [bulan, tanggal])

  function verified() {
    return model.nama.length > 2 && model.desa.length > 2 && model.kecamatan.length > 2 && bulan.length == 2 && tanggal.length == 2
  }

  function saveResponden(e) {
    // first entry in anggota
    let responden = model

    // Save responden/kk in daftar anggota
    let anggota = modelAnggota
    anggota.nama = model.nama
    anggota.gender = model.gender
    anggota.umur = model.umur
    anggota.hubungan = model.hubungan
    anggota.marital = model.marital
    anggota.pendidikan = model.pendidikan
    anggota.pekerjaan = model.pekerjaan
    anggota.kerentanan = kerentanan

    // const len = Object.keys(obj.anggota).length
    responden.anggota[0] = anggota

    const response = ipcRenderer.sendSync('save-responden', responden)
    router.push('/responden?id=' + response.id)
  }

  return (
    <div className="bg-gray-50 border-t border-b border-gray-200 text-gray-700 text-xs ">
      <div className="bg-gray-50 ml-8 border-l border-gray-200">
        <div className="flex flex-row bg-gray-1s00 px-7 py-6">
          <div className="pr-5">
            <table className="w-80">
              <tbody>
                <tr>
                  <td colSpan="2" className="w-36 h-9 whitespace-nowrap">
                    <span className="mr-2">Tgl wawancara:</span>
                    <select value={tanggal}
                      onChange={e => { setTanggal(e.target.value) }}
                      className="border pl-1 pr-2 py-1 mr-1 focus:border-blue-400 focus:outline-none">
                        <option value="0">-</option>
                        {dfTanggal.map((t) => (
                          <option key={t} value={t}>{parseInt(t)}</option>
                        ))}
                      </select>
                      <select value={bulan}
                      onChange={e => { setBulan(e.target.value) }}
                      className="border pl-1 pr-2 py-1 mr-1 focus:border-blue-400 focus:outline-none">
                        <option value="0">-</option>
                        {dfBulan.map(([val, text]) => (
                          <option key={text} value={val}>{text}</option>
                        ))}
                      </select>
                      <select disabled className="border bg-gray-100 py-1">
                        <option>2021</option>
                      </select>
                  </td>
                </tr>
                {leftContents.map(([key, text]) => (
                <tr key={text}>
                  <td className="w-36 h-9 whitespace-nowrap">{text}:</td>
                  <td className="w-48 h-9">
                    <Input model={model} field={key} setter={setter} />
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/*  */}
          <div className="flex-grow">
            <table className="w-full">
              <tbody>
              {rightContents.map(([key, text, df]) => (
                <tr key={text}>
                  <td className="w-36 h-9">{text}</td>
                  <td className="h-9">
                    <Select options={df} model={model} field={key} setter={setter} />
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t">
          <div className="flex flex-row">
            <div className="px-7 py-6">
              <button onClick={e => router.push('/home')}
                className="bg-gray-200 text-gray-500 font-semibold hover:shadow border border-gray-300 px-4 py-2 mr-3 hover:bg-white focus:outline-none focus:bg-gray-400s focus:border-purple-400"
              >Cancel</button>

              {!verified() && <button disabled
                className="bg-gray-200s text-gray-300 font-semibold border border-gray-200 px-4 py-2"
                >Save</button>}

              {verified() && <button onClick={saveResponden}
              className="bg-gray-200 text-gray-500 font-semibold hover:shadow border border-gray-300 px-4 py-2 hover:bg-white focus:outline-none focus:bg-gray-400s focus:border-purple-400"
              >Save Responden</button>}


            </div>
            <div className="flex-grow pr-7 py-6">
              {/* Nothing here... */}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}