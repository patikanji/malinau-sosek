import electron from 'electron'
import Layout from "../components/Layout"
import Subsection from '../components/Subsection'
import { useState, useEffect } from 'react'
import Section from "../components/Section"
import { useRouter } from 'next/router'
import {
  dfBerobat, dfFrekuensiBerobat, dfBAB, dfFaskes, dfKejadian, dfListrik, dfTinja,
  dfSumberair, dfMasalahAir, dfSampah, dfPenyakit, kejadianPenyakit, dfKategoriPenyakit,
  dfLimbahCair, dfSayur
} from '../lib/sosek'
import { getDataFromJsonFile, decimal } from '../lib/utils'
import Hero from '../components/Hero'
import NestedInput from '../components/NestedInput'
import Lanjut from '../components/Lanjut'
import Donut from '../components/Donut'
import Select from '../components/Select'

const ipcRenderer = electron.ipcRenderer || false
// const dataDir = ipcRenderer.sendSync('get-data-dir')
// const user = ipcRenderer.sendSync('get-user') || { name: 'ERROR' }


const Kesehatan = () => {
  const router = useRouter()
  const rsid = router.query['id']
  const dataDir = getDataDir()
  const resdata = rsid ? getDataFromJsonFile(dataDir, rsid) : false

  if (!resdata) return <h1>ERROR</h1>

  let config = {
    title: 'Kesehatan dan Lingkungan',
    back: '/aset?id=' + resdata.id,
    next: '/phbs?id=' + resdata.id,
    footer: true,
    user: getUser(),
    ribbon: 'Desa ' + resdata.desa,
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

  const [sosekData, setSosekData] = useState(resdata)
  const [sosekCopy, setSosekCopy] = useState(resdata)

  const [kejadian, setKejadian] = useState(kejadianPenyakit)
  const [showKejadian, setShowKejadian] = useState(false)

  const [locked, setLocked] = useState(true)


  function lockUnlock() { setLocked(!locked) }

  useEffect(() => {
    ipcRenderer.sendSync('save-responden', sosekData)
  }, [sosekData])

  function handleSelections(e, key) {
    const v = e.target.value
    if (e.currentTarget.checked) {
      if (v == 'Tidak ada' || v == 'Tidak pernah') {
        setSosekData(prev => ({
          ...prev,
          [key]: [v]
        }))
      } else {
        const arr1 = sosekData[key].filter((item) => (item !== 'Tidak ada'))
        const arr2 = arr1.filter((item) => (item !== 'Tidak pernah'))
        const arr3 = [...arr2, v]
        console.log(arr3)
        setSosekData(prev => ({
          ...prev,
          [key]: arr3
        }))
      }
    } else {
      const newArr = sosekData[key].filter((item) => item !== v);
      setSosekData(prev => ({
        ...prev,
        [key]: newArr
      }))
    }
  }

  const debug = false

  return (
    <Layout config={config}>
      <Hero title={rsid ? resdata.nama : config.title} ribbon={config.ribbon} />
      <Section text={config.title} />


      <div className="bg-gray-100 border-t border-b border-gray-200 text-gray-700 text-xs ">
        <div className="bg-gray-50 ml-8 pt-2 border-l border-gray-200">
          <div className="ml-5">
            <Donut text="Lock/unlock" handler={lockUnlock}/>

            <div className="-ml-5 pt-2 pb-6">
              <table className="w-full">
                <tbody>
                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>
                  <tr>
                    <td className="w-48 align-top pl-7">Kebiasaan berobat:</td>
                    <td className="pb-4">
                      <div className="flex flex-wrap">
                      {dfBerobat.map((v) => (
                        <label key={v} className="flex w-36 h-6 mr-4 hover:text-purple-500 cursor-pointer">
                          <input
                          disabled={locked}
                          checked={sosekData.tempatBerobat.indexOf(v) >= 0}
                          onChange={e => handleSelections(e, 'tempatBerobat')}
                          className="mr-1"
                          type="checkbox"
                          name="tempatBerobat"
                          value={v} />
                          <span className="">{v}</span>
                        </label>
                      ))}
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>

                  <tr>
                    <td className="w-48 align-top pl-7">Frekuensi kunjungan ke fasilitas kesehatan:</td>
                    <td className="pb-4">
                      <Select
                        disabled={locked}
                        options={dfFrekuensiBerobat}
                        model={sosekCopy}
                        field='frekuensiBerobat'
                        setter={setSosekData}
                      />
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>

                  <tr>
                    <td className="w-48 align-top pl-7 pr-4 pb-2">Kondisi faskes di desa/kecamatan:</td>
                    <td className="pb-4 pr-8">
                      <p className="mb-2">
                        <Select
                          disabled={locked}
                          options={dfFaskes}
                          model={sosekCopy}
                          field='kondisiFaskes'
                          setter={setSosekData}
                        />
                      </p>
                      <p>
                        <NestedInput style="w-full"
                          disabled={locked}
                          value={sosekCopy['kondisiFaskesInfo']}
                          model={sosekCopy}
                          nodes={['kondisiFaskesInfo']}
                          setter={setSosekCopy}
                          proxy={setSosekData}
                        />
                      {/* <input type="text"
                      className="w-full border focus:outline-none focus:border-blue-400 hover:border-blue-300 px-2 py-1"/> */}
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td className="w-48 align-top pl-7 pr-4 pb-2">Kepemilikan kartu kesehatan (KKS/KIP/KIS):</td>
                    <td className="pb-4 pr-8">
                      <p className="mb-2">
                        <Select
                          disabled={locked}
                          options={[
                            ['Semua anggota punya', 'Semua anggota punya'],
                            ['Sebagian anggota punya', 'Sebagian anggota punya'],
                            ['Tidaka ada', 'Tidaka ada'],
                          ]}
                          model={sosekCopy}
                          field='kartuKIS'
                          setter={setSosekData}
                        />
                      </p>
                      <p>
                        <NestedInput style="w-full"
                          disabled={locked}
                          value={sosekCopy['kartuKISInfo']}
                          model={sosekCopy}
                          nodes={['kartuKISInfo']}
                          setter={setSosekCopy}
                          proxy={setSosekData}
                        />
                      {/* <input type="text"
                      className="w-full border focus:outline-none focus:border-blue-400 hover:border-blue-300 px-2 py-1"/> */}
                      </p>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>
                  <tr>
                    <td className="w-48 align-top pl-7 pr-4 pb-2">
                      Sumber air untuk keperluan mandi-cuci:
                    </td>
                    <td className="pb-4 pr-8">
                      <div className="flex flex-wrap">
                      {dfSumberair.map((v) => (
                        <label className="flex w-36 h-6 mr-4 hover:text-purple-500 cursor-pointer">
                          <input
                          disabled={locked}
                          checked={sosekData.sumberAirMandi.indexOf(v) >= 0}
                          onChange={e => handleSelections(e, 'sumberAirMandi')}
                          className="mr-1"
                          type="checkbox"
                          name="sumberAirMandi"
                          value={v} />
                          <span className="">{v}</span>
                        </label>
                      ))}
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>
                  <tr>
                    <td className="w-48 align-top pl-7 pr-4 pb-2">
                      Sumber utama air minum untuk sehari-hari:
                    </td>
                    <td className="pb-4 pr-8">
                      <div className="flex flex-wrap">
                      {dfSumberair.map((v) => (
                        <label className="flex w-36 h-6 mr-4 hover:text-purple-500 cursor-pointer">
                          <input
                          disabled={locked}
                          checked={sosekData.sumberAirMinum.indexOf(v) >= 0}
                          onChange={e => handleSelections(e, 'sumberAirMinum')}
                          className="mr-1"
                          type="checkbox"
                          name="sumberAirMinum"
                          value={v} />
                          <span className="">{v}</span>
                        </label>
                      ))}
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>
                  <tr>
                    <td className="w-48 align-top pl-7 pr-4 pb-2">
                      Sumber utama air untuk masak:
                    </td>
                    <td className="pb-4 pr-8">
                      <div className="flex flex-wrap">
                      {dfSumberair.map((v) => (
                        <label className="flex w-36 h-6 mr-4 hover:text-purple-500 cursor-pointer">
                          <input
                          disabled={locked}
                          checked={sosekData.sumberAirMasak.indexOf(v) >= 0}
                          onChange={e => handleSelections(e, 'sumberAirMasak')}
                          className="mr-1"
                          type="checkbox"
                          name="sumberAirMasak"
                          value={v} />
                          <span className="">{v}</span>
                        </label>
                      ))}
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>
                  <tr>
                    <td className="w-48 align-top pl-7 pr-4 pb-2">
                      Masalah utama dalam penyediaan air bersih:
                    </td>
                    <td className="pb-4 pr-8">
                      <div className="flex flex-wrap">
                      {dfMasalahAir.map((v) => (
                        <label key={v} className="flex w-36 h-6 mr-4 hover:text-purple-500 cursor-pointer">
                          <input
                          disabled={locked}
                          checked={sosekData.sumberAirProblem.indexOf(v) >= 0}
                          onChange={e => handleSelections(e, 'sumberAirProblem')}
                          className="mr-1"
                          type="checkbox"
                          name="sumberAirProblem"
                          value={v} />
                          <span className="">{v}</span>
                        </label>
                      ))}
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>
                  <tr>
                    <td className="w-48 align-top pl-7 pr-4 pb-2">
                      Sumber listrik:
                    </td>
                    <td className="pb-4 pr-8">
                      <div className="flex flex-wrap">
                      {dfListrik.map((v) => (
                        <label key={v} className="flex w-36 h-6 mr-4 hover:text-purple-500 cursor-pointer">
                          <input
                          disabled={locked}
                          checked={sosekData.sumberListrik.indexOf(v) >= 0}
                          onChange={e => handleSelections(e, 'sumberListrik')}
                          className="mr-1"
                          type="checkbox"
                          name="sumberListrik"
                          value={v} />
                          <span className="">{v}</span>
                        </label>
                      ))}
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>
                  <tr>
                    <td className="w-48 align-top pl-7 pr-4 pb-2">
                      Kebiasaan mengelola sampah:
                    </td>
                    <td className="pb-4 pr-8">
                      <div className="flex flex-wrap">
                      {dfSampah.map((v) => (
                        <label className="flex w-36 h-6 mr-4 hover:text-purple-500 cursor-pointer">
                          <input
                          disabled={locked}
                          checked={sosekData.kelolaSampah.indexOf(v) >= 0}
                          onChange={e => handleSelections(e, 'kelolaSampah')}
                          className="mr-1"
                          type="checkbox"
                          name="kelolaSampah"
                          value={v} />
                          <span className="">{v}</span>
                        </label>
                      ))}
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>
                  <tr>
                    <td className="w-48 align-top pl-7 pr-4 pb-2">
                      Kebiasaan buang air besar:
                    </td>
                    <td className="pb-4 pr-8">
                      <div className="flex flex-wrap">
                      {dfBAB.map((v) => (
                        <label className="flex w-36 h-6 mr-4 hover:text-purple-500 cursor-pointer">
                          <input
                          disabled={locked}
                          checked={sosekData.bab.indexOf(v) >= 0}
                          onChange={e => handleSelections(e, 'bab')}
                          className="mr-1"
                          type="checkbox"
                          name="bab"
                          value={v} />
                          <span className="">{v}</span>
                        </label>
                      ))}
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>
                  <tr>
                    <td className="w-48 align-top pl-7 pr-4 pb-2">
                      Tempat pembuangan tinja:
                    </td>
                    <td className="pb-4 pr-8">
                      <div className="flex flex-wrap">
                      {dfTinja.map((v) => (
                        <label key={v} className="flex w-36 h-6 mr-4 hover:text-purple-500 cursor-pointer">
                          <input
                          disabled={locked}
                          checked={sosekData.tinja.indexOf(v) >= 0}
                          onChange={e => handleSelections(e, 'tinja')}
                          className="mr-1"
                          type="checkbox"
                          name="tinja"
                          value={v} />
                          <span className="">{v}</span>
                        </label>
                      ))}
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>
                  <tr>
                    <td className="w-48 align-top pl-7 pr-4 pb-2">
                      Ke mana limbah cair disalurkan?
                    </td>
                    <td className="pb-4 pr-8">
                      <div className="flex flex-wrap">
                      {dfLimbahCair.map((v) => (
                        <label key={v} className="flex w-36 h-6 mr-4 hover:text-purple-500 cursor-pointer">
                          <input
                          disabled={locked}
                          checked={sosekData.limbahCair.indexOf(v) >= 0}
                          onChange={e => handleSelections(e, 'limbahCair')}
                          className="mr-1"
                          type="checkbox"
                          name="limbahCair"
                          value={v} />
                          <span className="">{v}</span>
                        </label>
                      ))}
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>
                  <tr>
                    <td colSpan="2" className="align-top pl-7 pr-4 pb-2">
                      xxxxx sssss:
                    </td>
                  </tr>


                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>





      <Subsection icon="🎱" text="Kejadian penyakit 12 bulan terakhir" />
      <table className="tabular w-full bg-gray-50 text-xs">
        <thead>
          <tr className="bg-gray-100 text-gray-500 border-b">
            <th width="20" className="w-12 p-2 pl-6">&rarr;</th>
            <th width="" className="text-left border-l p-2">Penderita</th>
            <th width="80" className="text-right border-l p-2">Usia</th>
            <th width="" className="text-left border-l p-2">Jenis penyakit</th>
            <th width="" className="text-left border-l p-2">Kategori</th>
            <th width="60" className="text-left border-l p-2">&nbsp;</th>
          </tr>
        </thead>
        {/* mapping goes here */}
        <tbody>
          {sosekData.kejadianPenyakit.map((kejadian, index) => (
            <tr key={`${kejadian.nama}-${index}`} className="border-b hover:bg-white">
              <td className="w-12 p-2 pl-6">{index}</td>
              <td className="border-l p-2">{kejadian.nama}</td>
              <td className="border-l p-2">{kejadian.umur}</td>
              <td className="border-l p-2">{kejadian.penyakit}</td>
              <td className="border-l p-2">{kejadian.kategori}</td>
              <td className="border-l p-2">
              <button value={index}
              onClick={e => {
                let array = [...sosekData.kejadianPenyakit]
                array.splice(index, 1)
                setSosekData(prev => ({
                  ...prev,
                  kejadianPenyakit: array
                }))
              }}
              className="rounded hover:bg-pink-100 text-gray-300 focus:outline-none px-2 py-1"
              >🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showKejadian && <div className="bg-gray-50 px-10 py-6 text-xs">
        <div className="flex flex-row items-end">
          <div className="">
            <p className="text-xss text-gray-500 mb-1">Nama penderita</p>
            <select
              onChange={e => {
                const nama = e.target.value
                let umur = null
                sosekData.anggota.forEach(anggota => {
                  if (anggota.nama == nama) umur = anggota.umur
                })
                setKejadian(prev => ({
                  ...prev,
                  nama: nama,
                  umur: umur
                }))
              }}
              className="border pl-1 pr-3 py-1 focus:border-blue-400 focus:outline-none">
              <option></option>
              {sosekData.anggota.map(a => (
                <option value={a.nama}>{a.nama}</option>
              ))}
            </select>
          </div>
          <div className="ml-4">
            <p className="text-xss text-gray-500 mb-1">Jenis penyakit</p>
            <select
              onChange={e => {
                const v = e.target.value
                setKejadian(prev => ({
                  ...prev,
                  penyakit: v
                }))
              }}
              className="border pl-1 pr-3 py-1 focus:border-blue-400 focus:outline-none">
              <option></option>
              {dfPenyakit.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="ml-1">
            <p className="text-xss text-gray-300 mb-1">Keterangan</p>
            <input type="text"
              onChange={e => {
                const v = e.target.value
                setKejadian(prev => ({
                  ...prev,
                  keterangan: v
                }))
              }}
              className="border focus:outline-none focus:border-blue-400 hover:border-blue-300 px-2 py-1"
            />
          </div>
          <div className="ml-4">
            <p className="text-xss text-gray-500 mb-1">Kategori</p>
            <select
              onChange={e => {
                const v = e.target.value
                setKejadian(prev => ({
                  ...prev,
                  kategori: v
                }))
              }}
              className="border pl-1 pr-3 py-1 focus:border-blue-400 focus:outline-none">
              <option></option>
              {dfKategoriPenyakit.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="ml-4">
            <button
            onClick={e => {
              setSosekData(prev => ({
                ...prev,
                kejadianPenyakit: [
                  ...prev.kejadianPenyakit,
                  kejadian
                ]
              }))

              setShowKejadian(false)
            }}
            className="bg-gray-400 hover:bg-gray-500 border border-gray-400 hover:border-gray-500 focus:border-gray-700 focus:bg-gray-600 hover:text-gray-300 focus:text-gray-100 px-3 py-1 focus:outline-none"
            >Save</button>
          </div>
        </div>
      </div>}
      <div className="px-4 py-4 text-center text-xs">
        {!showKejadian && <button
          onClick={e => {
            setKejadian(kejadianPenyakit)
            setShowKejadian(true)
          }}
          className="border border-gray-300 hover:border-gray-400 text-gray-400 hover:text-gray-500 font-semibold px-8 py-2 hover:shadow hover:bg-white focus:outline-none focus:border-gray-400"
        >Add</button>}
        {showKejadian && <button
          onClick={e => {
            setKejadian(kejadianPenyakit)
            setShowKejadian(false)
          }}
          className="border border-red-300 hover:border-red-400 text-gray-400 hover:text-red-400 font-semibold px-8 py-2 hover:shadow hover:bg-white focus:outline-none focus:border-gray-400"
        >Cancel</button>}
      </div>

      {debug && (
      <div className="grid grid-cols-4 gap-0 border-b border-t">
        <div className="px overflow-y-auto">
          <pre className="h-56">

            <br/>----------<br/>
            {JSON.stringify(sosekData.tempatBerobat, null, 2)}
          </pre>
        </div>
        <div className="border-l px overflow-y-auto">
          <pre className="h-56">
            {JSON.stringify(sosekData.sumberListrik, null, 2)}
            <br/>----------<br/>
            {JSON.stringify(sosekData.tempatBerobat, null, 2)}
          </pre>
        </div>
        <div className="border-l px overflow-y-auto">
          <pre className="h-56">
            {JSON.stringify(kejadian, null, 2)}
            <br/>----------<br/>
            {JSON.stringify(sosekData.kejadianPenyakit, null, 2)}
          </pre>
        </div>
        <div className="border-l px overflow-y-auto">
          <pre className="h-56">
          {JSON.stringify(sosekData, null, 2)}
            ----<br/>
          </pre>
        </div>
      </div>)}

      <Lanjut/>
    </Layout>
  )
}

export default Kesehatan