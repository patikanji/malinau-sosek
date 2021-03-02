import electron from 'electron'
import Link from 'next/link'
import Layout from "../components/Layout"
import Subsection from '../components/Subsection'
import { useState, useEffect } from 'react'
import Section from "../components/Section"
import { useRouter } from 'next/router'
import { dfSumberMakan, dfBelanja, dfPendapatan, dfPekerjaan } from '../lib/sosek'
import { getDataFromJsonFile, decimal } from '../lib/utils'
import Hero from '../components/Hero'
import NestedInput from '../components/NestedInput'
import Nested2Select from '../components/Nested2Select'
import Donut from '../components/Donut'
import Lanjut from '../components/Lanjut'

const ipcRenderer = electron.ipcRenderer || false
// const dataDir = ipcRenderer.sendSync('get-data-dir')
// const user = ipcRenderer.sendSync('get-user') || { name: 'ERROR' }


const Ekonomi = () => {
  // const dataDir = ipcRenderer.sendSync('get-data-dir')
  // const user = ipcRenderer.sendSync('get-user') || { name: 'ERROR' }
  const router = useRouter()
  const rsid = router.query['id']
  const dataDir = getDataDir()
  const resdata = rsid ? getDataFromJsonFile(dataDir, rsid) : false

  if (!resdata) return <h1>ERROR</h1>

  let config = {
    title: 'Pendapatan dan Belanja',
    back: '/responden?id=' + resdata.id,
    next: '/aset?id=' + resdata.id,
    footer: true,
    user: getUser(),
    ribbon: 'Desa ' + resdata.desa,
  }

  const [sosekData, setSosekData] = useState(resdata)
  const [sosekCopy, setSosekCopy] = useState(resdata)

  const [arrPekerjaan, setArrPekerjaan] = useState(sosekData.pekerjaanLain)
  const [arrPendapatan, setArrPendapatan] = useState(sosekData.sumberPendapatan)
  const [arrBelanja, setArrBelanja] = useState(sosekData.sumberPengeluaran)

  const [locked, setLocked] = useState(true)

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

  function lockUnlock() { setLocked(!locked) }

  function handlePekerjaan(e) {
    if (e.currentTarget.checked) {
      setArrPekerjaan(prev => [
        ...prev, e.target.value
      ]);

      setSosekData(prev => ({
        ...prev,
        pekerjaanLain: [
          ...prev.pekerjaanLain,
          e.target.value
        ]
      }))
    } else {
      const newArr = arrPekerjaan.filter((item) => item !== e.target.value);
      setArrPekerjaan(newArr);
      setSosekData(prev => ({
        ...prev,
        pekerjaanLain: newArr
      }))
    }
  }

  function handlePendapatan(e) {
    if (e.currentTarget.checked) {
      setArrPendapatan(prev => [
        ...prev, e.target.value
      ]);

      setSosekData(prev => ({
        ...prev,
        sumberPendapatan: [
          ...prev.sumberPendapatan,
          e.target.value
        ]
      }))
    } else {
      const newArr = arrPendapatan.filter((item) => item !== e.target.value);
      setArrPendapatan(newArr);
      setSosekData(prev => ({
        ...prev,
        sumberPendapatan: newArr
      }))
    }
  }

  function handleBelanja(e) {
    if (e.currentTarget.checked) {
      setArrBelanja(prev => [
        ...prev, e.target.value
      ]);

      setSosekData(prev => ({
        ...prev,
        sumberPengeluaran: [
          ...prev.sumberPengeluaran,
          e.target.value
        ]
      }))
    } else {
      const newArr = arrBelanja.filter((item) => item !== e.target.value);
      setArrBelanja(newArr);
      setSosekData(prev => ({
        ...prev,
        sumberPengeluaran: newArr
      }))
    }
  }

  useEffect(() => {
    ipcRenderer.sendSync('save-responden', sosekData)
  }, [sosekData])

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
                    <td className="w-48 align-top pl-7 pt-2">Pekerjaan lain KK:</td>
                    <td className="pb-4">
                      <div className="flex flex-wrap">
                      {dfPekerjaan.map(([v]) => (
                        <label key={v} className="flex w-36 h-6 mr-4 hover:text-purple-500 cursor-pointer">
                          <input disabled={locked}
                          checked={sosekData.pekerjaanLain.indexOf(v) >= 0}
                          onChange={handlePekerjaan}
                          className="mr-1"
                          type="checkbox"
                          name="pekerjaanLain"
                          value={v} />
                          <span className="">{v}</span>
                        </label>
                      ))}
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>

                  <tr>
                    <td className="w-48 align-top pl-7 pt-2">Pendapatan per bulan:</td>
                    <td className="pb-4">
                      <NestedInput
                        value={sosekCopy.pendapatanPerBulan}
                        isNumber={true}
                        model={sosekCopy}
                        nodes={['pendapatanPerBulan']}
                        setter={setSosekCopy}
                        proxy={setSosekData}
                        style="w-36 mr-2"
                      />
                      <input type="text" disabled value={decimal(sosekData.pendapatanPerBulan)} className="w-24 bg-gray-100 text-gray-400 text-right px-2 py-1"/>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>

                  <tr>
                    <td className="w-48 align-top pl-7 pts-2">Sumber pendapatan:<br/>
                    </td>
                    <td className="pb-4">
                      <div className="flex flex-wrap">
                      {dfPendapatan.map(([v]) => (
                        <label key={v} className="flex w-36 h-6 mr-4 hover:text-purple-500 cursor-pointer">
                          <input disabled={locked} checked={sosekData.sumberPendapatan.indexOf(v) >= 0} onChange={handlePendapatan} className="mr-1" type="checkbox" name="pekerjaanLain" value={v} />
                          <span className="">{v}</span>
                        </label>
                      ))}
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>

                  <tr>
                    <td className="w-48 align-top pl-7 pt-2">Pengeluaran per bulan:</td>
                    <td className="pb-4">
                      <NestedInput
                      value={sosekCopy.pengeluaranPerBulan}
                      isNumber={true}
                      model={sosekCopy}
                      nodes={['pengeluaranPerBulan']}
                      setter={setSosekCopy}
                      proxy={setSosekData}
                      style="w-36 mr-2"
                      />
                      <input disabled type="text" value={decimal(sosekData.pengeluaranPerBulan)} className="w-24 bg-gray-100 text-gray-400 text-right px-2 py-1"/>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>

                  <tr>
                    <td className="w-48 align-top pl-7 pt-2">Jenis-jenis belanja:</td>
                    <td className="pb-4">
                      <div className="flex flex-wrap">
                      {dfBelanja.map(([v]) => (
                        <label key={v} className="flex w-36 h-6 mr-4 hover:text-purple-500 cursor-pointer">
                          <input disabled={locked} checked={sosekData.sumberPengeluaran.indexOf(v) >= 0} onChange={handleBelanja} className="mr-1" type="checkbox" name="pekerjaanLain" value={v} />
                          <span className="">{v}</span>
                        </label>
                      ))}
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>

                  <tr>
                    <td className="w-48 align-top pl-7 pt-2">Asal/sumber makanan:</td>
                    <td className="pb-4s">
                      <div className="flex flex-wrap">
                        <div className="pr-4 pb-3">
                          <p className="text-xs text-gray-400 mb-1">Nasi/ubi/sagu</p>
                          <Nested2Select disabled={locked} options={dfSumberMakan} model={sosekData} nodes={['sumberMakanan', 'nasi']} setter={setSosekData} />
                        </div>
                        <div className="pr-4 pb-3">
                          <p className="text-xs text-gray-400 mb-1">Lauk pauk</p>
                          <Nested2Select disabled={locked} options={dfSumberMakan} model={sosekData} nodes={['sumberMakanan', 'lauk']} setter={setSosekData} />
                        </div>
                        <div className="pr-4 pb-3">
                          <p className="text-xs text-gray-400 mb-1">Minyak, bumbu, ...</p>
                          <Nested2Select disabled={locked} options={dfSumberMakan} model={sosekData} nodes={['sumberMakanan', 'bumbu']} setter={setSosekData} />
                        </div>
                        <div className="pr-4 pb-3">
                          <p className="text-xs text-gray-400 mb-1">Gula, kopi, susu, ...</p>
                          <Nested2Select disabled={locked} options={dfSumberMakan} model={sosekData} nodes={['sumberMakanan', 'gulaKopi']} setter={setSosekData} />
                        </div>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* debug */}
      {debug && (
      <div className="grid grid-cols-4 gap-0 border-b">
        <div className="px overflow-y-auto">
          <pre className="h-56">
            {JSON.stringify(arrPekerjaan, null, 2)}
            <br/>----------<br/>
            {JSON.stringify(sosekData.pekerjaanLain, null, 2)}
          </pre>
        </div>
        <div className="border-l px overflow-y-auto">
          <pre className="h-56">
            {JSON.stringify(arrPendapatan, null, 2)}
            <br/>----------<br/>
            {JSON.stringify(sosekData.sumberPendapatan, null, 2)}
          </pre>
        </div>
        <div className="border-l px overflow-y-auto">
          <pre className="h-56">
            {JSON.stringify(arrBelanja, null, 2)}
            <br/>----------<br/>
            {JSON.stringify(sosekData.sumberPengeluaran, null, 2)}
          </pre>
        </div>
        <div className="border-l px overflow-y-auto">
          <pre className="h-56">
            Nasi:     {sosekData.sumberMakanan.nasi}<br/>
            Lauk:     {sosekData.sumberMakanan.lauk}<br/>
            Bumbu:    {sosekData.sumberMakanan.bumbu}<br/>
            GulaKopi: {sosekData.sumberMakanan.gulaKopi}<br/>
            ----<br/>
            pendapatan:  {sosekData.pendapatanPerBulan}<br/>
            pengeluaran: {sosekData.pengeluaranPerBulan}<br/>
          </pre>
        </div>
      </div>)}

      <Lanjut/>
    </Layout>
  )
}

export default Ekonomi
