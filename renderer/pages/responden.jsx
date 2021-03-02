import electron from 'electron'
import Link from 'next/link'
import Layout from "../components/Layout"
import Subsection from '../components/Subsection'
import { useState, useEffect } from 'react'
import Section from "../components/Section"
import { useRouter } from 'next/router'
import { modelAnggota, dfTanggal, dfBulan, dfGender, dfHubungan, dfRentan, dfStatus, dfAgama, dfPendidikan, dfPekerjaan, dfMukim } from '../lib/sosek'
import { getDataFromJsonFile } from '../lib/utils'
import Hero from '../components/Hero'
import Select from '../components/Select'
import NestedInput from '../components/NestedInput'
import SosekInput from '../components/SosekInput'
import Donut from '../components/Donut'
import Lanjut from '../components/Lanjut'

const ipcRenderer = electron.ipcRenderer || false

const leftContents = [
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
  const router = useRouter()
  const rsid = router.query['id']
  const dataDir = getDataDir()
  const resdata = rsid ? getDataFromJsonFile(dataDir, rsid) : false

  let config = {
    title: 'New Responden',
    back: '',
    next: '',
    footer: true,
    user: getUser(),
    ribbon: 'masukkan data dengan ejaan yang benar',
  }

  if (!resdata) return <h1>ERROR</h1>

  config.title = resdata.nama
  config.ribbon = 'Desa ' + resdata.desa
  config.next = '/ekonomi?id=' + resdata.id

  const [sosekData, setSosekData] = useState(resdata)
  const [sosekCopy, setSosekCopy] = useState(resdata)
  const [anggota, setAnggota] = useState(null)

  const [tanggal, setTanggal] = useState(resdata.tanggal.split('-')[2])
  const [bulan, setBulan] = useState(resdata.tanggal.split('-')[1])

  const [show, setShow] = useState(false)
  const [profilDisabled, setProfilDisabled] = useState(true)

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

  useEffect(() => {
    ipcRenderer.sendSync('save-responden', sosekData)
  }, [sosekData])

  useEffect(() => {
    setSosekData(prev => ({
      ...prev,
      tanggal: `2021-${bulan}-${tanggal}`
    }))
  }, [bulan, tanggal])

  function verified() {
    return (
      anggota.nama.length > 2 &&
      anggota.umur.length > 0 &&
      anggota.gender.length > 0 &&
      anggota.hubungan.length > 0 &&
      anggota.marital.length > 0 &&
      anggota.pendidikan.length > 0 &&
      anggota.pekerjaan.length > 0
    )
  }

  function lockUnlock() {
    setProfilDisabled(!profilDisabled)
  }

  return (
    <Layout config={config}>
      <Hero title={rsid ? resdata.nama : config.title} ribbon={config.ribbon} />
      <Section text={'Profil Responden'} />




      <div className="bg-gray-100 border-t border-b border-gray-200 text-gray-700 text-xs ">
        <div className="bg-gray-50 ml-8 pt-4 border-l border-gray-200">
          <div className="ml-5">
            <Donut text="Lock/unlock" handler={lockUnlock}/>
          </div>
          <div className="flex flex-row bg-gray-1s00 px-7 pt-2 pb-6">
            <div className="pr-5">
              <table className="w-80">
                <tbody>
                  <tr>
                    <td colSpan="2" className="w-36 h-9 whitespace-nowrap">
                      <span className="mr-2">Tanggal data:</span>
                      <select value={tanggal}
                      disabled={profilDisabled}
                      onChange={e => { setTanggal(e.target.value) }}
                      className="border pl-1 pr-2 py-1 mr-1 focus:border-blue-400 focus:outline-none">
                        <option value="0">-</option>
                        {dfTanggal.map((t) => (
                          <option key={t} value={t}>{parseInt(t)}</option>
                        ))}
                      </select>
                      <select value={bulan}
                      disabled={profilDisabled}
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
                  <tr>
                    <td className="w-36 h-9 whitespace-nowrap">{text}:</td>
                    <td className="w-48 h-9">
                      <NestedInput
                        disabled={profilDisabled}
                        value={sosekCopy[key]}
                        model={sosekCopy}
                        nodes={[key]}
                        setter={setSosekCopy}
                        proxy={setSosekData}
                      />
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
                      <Select
                        disabled={profilDisabled}
                        options={df} model={sosekCopy}
                        field={key}
                        setter={setSosekData}
                      />
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>


      <Subsection icon="🦸🏻‍♂️" text="Anggota Keluarga" />


      <table className="tabular w-full bg-gray-50 text-xs">
        <thead>
          <tr className="bg-gray-100 text-gray-500 border-b">
            <th className="w-12 p-2 pl-6">&rarr;</th>
            <th width="" className="text-left">Nama</th>
            <th width="" className="text-left">Hubungan</th>
            <th width="" className="text-left">Status</th>
            <th width="" className="text-left">L/P</th>
            <th width="" className="text-left">U</th>
            <th width="" className="text-left">Kerentanan</th>
            <th width="" className="text-left">Pendidikan</th>
            <th width="" className="text-left">Pekerjaan</th>
            <th width="30" className="text-left">&nbsp;</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b bg-yellow-50">
            <td className="w-12 p-2 pl-6">1</td>
            <td className="p-2">{sosekData.nama}</td>
            <td className="p-2">{sosekData.hubungan}</td>
            <td className="p-2">{sosekData.marital}</td>
            <td className="p-2">{sosekData.gender}</td>
            <td className="p-2">{sosekData.umur}</td>
            <td className="p-2">{sosekData.kerentanan}</td>
            <td className="p-2">{sosekData.pendidikan}</td>
            <td className="p-2">{sosekData.pekerjaan}</td>
            <td className="p-2 pr-6">
              <button className="rounded hover:bg-pink-100 text-base text-gray-300 focus:outline-none pl-2">🤖</button>
            </td>
          </tr>
        {sosekData.anggota
        .map(({ nama, hubungan, marital, gender, umur, kerentanan, pendidikan, pekerjaan }, index) => (
          <tr key={`${nama}-${kerentanan}`} className={index == 0 ? 'hidden' : `border-b hover:bg-white`}>
            <td className="w-12 p-2 pl-6">{index + 1}</td>
            <td className="p-2">{nama}</td>
            <td className="p-2">{hubungan}</td>
            <td className="p-2">{marital}</td>
            <td className="p-2">{gender}</td>
            <td className="p-2">{umur}</td>
            <td className="p-2">{kerentanan}</td>
            <td className="p-2">{pendidikan}</td>
            <td className="p-2">{pekerjaan}</td>
            <td className="p-2 pr-6">
              <button value={index} disabled={index == 0}
              onClick={e => {
                let array = [...sosekData.anggota]
                array.splice(index, 1)
                setSosekData(prev => ({
                  ...prev,
                  anggota: array
                }))
              }}
              className="rounded hover:bg-pink-100 text-gray-300 focus:outline-none px-2 py-1"
              >🗑</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

{/* <pre className="text-xs">{JSON.stringify(anggota, null, 2)}</pre> */}

      {!show && (
      <div className="px-4 py-4 text-center text-xs">
        <button
          onClick={e => {
            setShow(true)
            setAnggota(modelAnggota)
          }}
          className="border border-gray-200 text-gray-500 font-semibold px-8 py-2 hover:shadow hover:bg-white focus:outline-none focus:border-gray-400"
        >Add</button>
      </div>
      )}


      {/* Form anggota */}
      {show && (
      <div className="bg-gray-100 border-b">
        <div className="bg-gray-100 ml-8 border-l border-gray-200">
          <div className="flex flex-row bg-gray-1s00 px-7 py-4">
            <div className="pr-5">
              <table className="w-72 text-xs">
                <tbody>
                  <tr>
                    <td className="w-36 h-9 whitespace-nowrap">
                      Nama:
                    </td>
                    <td className="w-48 h-9">
                      <SosekInput autofous={true} model={anggota} field={'nama'} setter={setAnggota}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-36 h-9 whitespace-nowrap">
                      Umur:
                    </td>
                    <td className="w-48 h-9">
                      <SosekInput model={anggota} field={'umur'} setter={setAnggota} width="w-10"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-36 h-9 whitespace-nowrap">
                      Jenis kelamin:
                    </td>
                    <td className="w-48 h-9">
                      <Select options={dfGender} model={anggota} field='gender' setter={setAnggota}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-36 h-9 whitespace-nowrap">
                      Hubungan:
                    </td>
                    <td className="w-48 h-9">
                      <Select options={dfHubungan} model={anggota} field='hubungan' setter={setAnggota}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-36 h-9 whitespace-nowrap">
                      Status perkawinan:
                    </td>
                    <td className="w-48 h-9">
                      <Select options={dfStatus} model={anggota} field='marital' setter={setAnggota} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/*  */}
            <div className="flex-grow">
              <table className="text-xs">
                <tbody>
                  <tr>
                    <td className="w-36 h-9">Kerentanan:</td>
                    <td className="h-9">
                      <Select options={dfRentan} model={anggota} field='kerentanan' setter={setAnggota} />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-36 h-9">Pendidikan:</td>
                    <td className="h-9">
                      <Select options={dfPendidikan} model={anggota} field='pendidikan' setter={setAnggota} />
                    </td>
                  </tr>
                  <tr>
                    <td className="w-36 h-9">Pekerjaan:</td>
                    <td className="h-9">
                      <Select options={dfPekerjaan} model={anggota} field='pekerjaan' setter={setAnggota} />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="">
                      <hr className="mt-3 mb-4"/>
                      <button
                        onClick={e => {
                          setShow(false)
                          setAnggota(modelAnggota)
                        }}
                        className="bg-gray-400 border border-transparent text-white font-semibold px-4 py-2 mr-3 hover:bg-gray-500 focus:outline-none active:bg-gray-600 focus:border-gray-700"
                      >Cancel</button>

                      {!verified() && <button disabled
                        className="bg-gray-100 border border-gray-300 text-gray-400 font-semibold border px-4 py-2"
                      >Save</button>}

                      {verified() && <button
                        onClick={e => {
                          setSosekData(prev => ({
                            ...prev,
                            anggota: [
                              ...prev.anggota,
                              anggota
                            ]
                          }))

                          setShow(false)
                          setAnggota(modelAnggota)
                        }}
                        className="bg-gray-400 border border-transparent text-white font-semibold px-4 py-2 mr-3 hover:bg-gray-500 focus:outline-none active:bg-gray-600 focus:border-gray-700"
                      >Save Anggota</button>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      )}

      <Lanjut/>

      <style jsx>{`
      .flip-h {
        transform: scale(-1, 1);
      }
      `}</style>
    </Layout>
  )
}

export default Page
