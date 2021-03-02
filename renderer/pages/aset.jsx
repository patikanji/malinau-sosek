import electron from 'electron'
import Layout from "../components/Layout"
import Subsection from '../components/Subsection'
import { useState, useEffect } from 'react'
import Section from "../components/Section"
import { useRouter } from 'next/router'
import { dfKategoriRumah, dfKondisiRumah, dfKepemilikan, hasilAlam, hasilTani } from '../lib/sosek'
import { getDataFromJsonFile, decimal } from '../lib/utils'
import Hero from '../components/Hero'
import NestedInput from '../components/NestedInput'
import Nested2Select from '../components/Nested2Select'
import Nested2Input from '../components/Nested2Input'
import Donut from '../components/Donut'
import Lanjut from '../components/Lanjut'

const ipcRenderer = electron.ipcRenderer || false
// const dataDir = ipcRenderer.sendSync('get-data-dir')
// const user = ipcRenderer.sendSync('get-user') || { name: 'ERROR' }

const modelHasilTani = hasilTani
const modelHasilAlam = hasilAlam


const Aset = () => {
  const router = useRouter()
  const rsid = router.query['id']
  const dataDir = getDataDir()
  const resdata = rsid ? getDataFromJsonFile(dataDir, rsid) : false

  if (!resdata) return <h1>ERROR</h1>

  let config = {
    title: 'Rumah, Tanah, dan Hasil Alam',
    back: '/ekonomi?id=' + resdata.id,
    next: '/kesehatan?id=' + resdata.id,
    footer: true,
    user: getUser(),
    ribbon: 'Desa ' + resdata.desa,
  }

  const [sosekData, setSosekData] = useState(resdata)
  const [sosekCopy, setSosekCopy] = useState(resdata)

  const [arrPekerjaan, setArrPekerjaan] = useState([])
  const [arrPendapatan, setArrPendapatan] = useState([])
  const [arrBelanja, setArrBelanja] = useState([])

  const [hasilTani, setHasilTani] = useState(modelHasilTani)
  const [hasilAlam, setHasilAlam] = useState(modelHasilAlam)

  const [locked, setLocked] = useState(true)

  const [showTani, setShowTani] = useState(false)
  const [showTernak, setShowTernak] = useState(false)
  const [showIkan, setShowIkan] = useState(false)
  const [showHutan, setShowHutan] = useState(false)
  const [showSatwa, setShowSatwa] = useState(false)

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

  function cekHasilTani() {
    return (hasilTani.jenis && hasilTani.luas && hasilTani.dikonsumsi && hasilTani.dijual && hasilTani.nilai) ? true : false
  }

  function cekHasilAlam() {
    return (hasilAlam.jenis && hasilAlam.satuan && hasilAlam.dikonsumsi >= 0 && hasilAlam.dijual >= 0 && hasilAlam.nilai > 0) ? true : false
  }

  useEffect(() => {
    ipcRenderer.sendSync('save-responden', sosekData)
  }, [sosekData])

  const debug = false

  function BtnAdd({ flag, handler }) {
    return (
      <div className="px-4 py-4 text-center text-xs">
        {!flag && <button
          onClick={handler}
          className="border border-gray-300 hover:border-gray-400 text-gray-400 hover:text-gray-500 font-semibold px-8 py-2 hover:shadow hover:bg-white focus:outline-none focus:border-gray-400"
        >Add</button>}
        {flag && <button
          onClick={handler}
          className="border border-red-300 hover:border-red-400 text-gray-400 hover:text-red-400 font-semibold px-8 py-2 hover:shadow hover:bg-white focus:outline-none focus:border-gray-400"
        >Cancel</button>}
      </div>
    )
  }

  return (
    <Layout config={config}>
      <Hero title={rsid ? resdata.nama : config.title} ribbon={config.ribbon} />

      <Section text={config.title} />
      <div className="bg-gray-100 border-t border-b border-gray-200 text-gray-700 text-xs ">
        <div className="bg-gray-50 ml-8 pt-2 border-l border-gray-200">
          <div className="ml-5">
            <Donut text="Lock/unlock" handler={lockUnlock}/>

            <div className="-ml-5 pt-2 pb-2">
              <table className="w-full">
                <tbody>
                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>
                  <tr>
                    <td className="w-48 align-top pl-7 pt-2">Rumah tinggal:</td>
                    <td className="pb-4">
                      <div className="flex flex-wrap">
                        <div className="pr-4 pb-3">
                          <p className="text-xs text-gray-400 mb-1">Kategori fisik</p>
                          <Nested2Select disabled={locked} options={dfKategoriRumah} model={sosekData} nodes={['rumah', 'struktur']} setter={setSosekData} />
                        </div>
                        <div className="pr-4 pb-3">
                          <p className="text-xs text-gray-400 mb-1">Kondisi fisik</p>
                          <Nested2Select disabled={locked} options={dfKondisiRumah} model={sosekData} nodes={['rumah', 'kerusakan']} setter={setSosekData} />
                        </div>
                        <div className="pr-4 pb-3">
                          <p className="text-xs text-gray-400 mb-1">Status kepemilikan</p>
                          <Nested2Select disabled={locked} options={dfKepemilikan} model={sosekData} nodes={['rumah', 'kepemilikan']} setter={setSosekData} />
                        </div>
                        <div className="pb-3">
                  <p className="text-xs text-gray-400 mb-1">Jumlah ruang</p>
                  <Nested2Input
                    disabled={locked}
                    value={sosekCopy.rumah.ruang}
                    isNumber={true}
                    model={sosekCopy}
                    nodes={['rumah', 'ruang']}
                    setter={setSosekCopy}
                    proxy={setSosekData}
                  style="w-20 mr-4" />
                </div>
                <div className="w-1/2 pr-4 pb-3">
                  <p className="text-xs text-gray-400 mb-1">Bukti kepemilikan</p>
                  <Nested2Input
                  disabled={locked}
                  value={sosekCopy.rumah.buktiKepemilikan}
                  isNumber={false}
                  model={sosekCopy}
                  nodes={['rumah', 'buktiKepemilikan']}
                  setter={setSosekCopy}
                  proxy={setSosekData}
                  style="w-full mr-4" />
                </div>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>

                  <tr>
                    <td className="w-48 align-top pl-7 pt-2">Kepemilikan tanah:</td>
                    <td className="pb-4">
                      <div className="flex flex-wrap items-end">
                        <div className="pr-s4 pb-3">
                          <div className="text-gray-400 mb-1">Rumah dan<br/>pekarangan</div>
                          <Nested2Input
                          disabled={locked}
                          value={sosekCopy.tanah.rumah}
                          isNumber={true}
                          model={sosekCopy}
                          nodes={['tanah', 'rumah']}
                          setter={setSosekCopy}
                          proxy={setSosekData}
                          style="w-20 mr-4"
                          />
                        </div>
                        <div className="pr-s4 pb-3">
                          <p className="text-xs text-gray-400 mb-1">Kebun</p>
                          <Nested2Input
                          disabled={locked}
                          value={sosekCopy.tanah.kebun}
                          isNumber={true}
                          model={sosekCopy}
                          nodes={['tanah', 'kebun']}
                          setter={setSosekCopy}
                          proxy={setSosekData}
                          style="w-20 mr-4" />
                        </div>
                        <div className="pr-s4 pb-3">
                          <p className="text-xs text-gray-400 mb-1">Sawah</p>
                          <Nested2Input
                          disabled={locked}
                          value={sosekCopy.tanah.sawah}
                          isNumber={true}
                          model={sosekCopy}
                          nodes={['tanah', 'sawah']}
                          setter={setSosekCopy}
                          proxy={setSosekData}
                          style="w-20 mr-4" />
                        </div>
                        <div className="pr-s4 pb-3">
                          <p className="text-xs text-gray-400 mb-1">Ladang</p>
                          <Nested2Input
                          disabled={locked}
                          value={sosekCopy.tanah.ladang}
                          isNumber={true}
                          model={sosekCopy}
                          nodes={['tanah', 'ladang']}
                          setter={setSosekCopy}
                          proxy={setSosekData}
                          style="w-20 mr-4" />
                        </div>
                        <div className="pr-s4 pb-3">
                          <p className="text-xs text-gray-400 mb-1">Lahan<br/>nonproduktif</p>
                          <Nested2Input
                          disabled={locked}
                          value={sosekCopy.tanah.nonProduktif}
                          isNumber={true}
                          model={sosekCopy}
                          nodes={['tanah', 'nonProduktif']}
                          setter={setSosekCopy}
                          proxy={setSosekData}
                          style="w-20 mr-4" />
                        </div>
                        <div className="pr-s4 pb-3">
                          <p className="text-xs text-gray-400 mb-1">Lainnya</p>
                          <Nested2Input
                          disabled={locked}
                          value={sosekCopy.tanah.lainnya}
                          isNumber={true}
                          model={sosekCopy}
                          nodes={['tanah', 'lainnya']}
                          setter={setSosekCopy}
                          proxy={setSosekData}
                          style="w-20 mr-4" />
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

      <Subsection icon="🎱" text="hasil pertanian per tahun" />
      <table className="w-full bg-gray-50 text-xs">
        <thead>
          <tr className="bg-gray-100 text-gray-500 border-b">
            <th className="w-12 p-2 pl-6">&rarr;</th>
            <th width="" className="text-left border-l p-2">Jenis</th>
            <th width="" className="text-right border-l p-2">Luas</th>
            <th width="" className="text-right border-l p-2">Dikonsumsi</th>
            <th width="" className="text-left border-l p-2">Untuk</th>
            <th width="" className="text-right border-l p-2">Dijual</th>
            <th width="" className="text-right border-l p-2">Nilai</th>
            <th width="30" className="text-left border-l p-2">&nbsp;</th>
          </tr>
        </thead>
        <tbody className="mapping">
          {sosekData.hasilPertanian.map(({jenis, luas, dikonsumsi, untuk, dijual, nilai}, index) => (
          <tr key={`${jenis}-${nilai}`} className="border-b">
            <td className="w-12 p-2 pl-6">{index + 1}</td>
            <td width="36%" className="p-2 border-l">{jenis}</td>
            <td width="13%" className="p-2 border-l text-right whitespace-nowrap">{luas} <span className="ml-1 text-gray-300">Kg</span></td>
            <td width="13%" className="p-2 border-l text-right whitespace-nowrap">{decimal(dikonsumsi)} <span className="ml-1 text-gray-300">Kg</span></td>
            <td width="13%" className="p-2 border-l whitespace-nowrap">{untuk}<span className="ml-1 text-gray-300"></span></td>
            <td width="13%" className="p-2 border-l text-right whitespace-nowrap">{decimal(dijual)} <span className="ml-1 text-gray-300">Kg</span></td>
            <td width="13%" className="p-2 border-l text-right whitespace-nowrap"><span className="float-left ml-2 text-gray-300">Rp</span> {decimal(nilai)}</td>
            <td className="border-l td-action leading-nones p-2 pr-6">
              <button value={index}
              onClick={e => {
                let array = [...sosekData.hasilPertanian]
                array.splice(index, 1)
                setSosekData(prev => ({
                  ...prev,
                  hasilPertanian: array
                }))
              }}
              className="rounded hover:bg-pink-100 text-gray-300 focus:outline-none px-2 py-1"
              >🗑</button>
            </td>
          </tr>
        ))}
        </tbody>
        {showTani && (<tbody className="form">
          <tr className="border-b">
          <td className="p-2 text-right">&rarr;</td>
            <td className="form border-l p-2">
              <NestedInput autofocus={true} id="jenis-tani"
              value={hasilTani.jenis}
              isNumber={false}
              model={hasilTani}
              nodes={['jenis']}
              setter={setHasilTani}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilTani.luas}
              isNumber={true}
              model={hasilTani}
              nodes={['luas']}
              setter={setHasilTani}
              style="w-full text-blue-500"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilTani.dikonsumsi}
              isNumber={true}
              model={hasilTani}
              nodes={['dikonsumsi']}
              setter={setHasilTani}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput autofocus={true} id="jenis-tani"
              value={hasilTani.untuk}
              isNumber={false}
              model={hasilTani}
              nodes={['untuk']}
              setter={setHasilTani}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
            <NestedInput
              value={hasilTani.dijual}
              isNumber={true}
              model={hasilTani}
              nodes={['dijual']}
              setter={setHasilTani}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
            <NestedInput
              value={hasilTani.nilai}
              isNumber={true}
              model={hasilTani}
              nodes={['nilai']}
              setter={setHasilTani}
              style="w-full"
              />
            </td>
            <td className="form whitespace-nowrap border-l p-2 pr-6">
            {!cekHasilTani() && (
              <button disabled className="bg-gray-200 text-gray-300 px-2 py-1">OK</button>
            )}
            {cekHasilTani() && (
              <button
              onClick={e => {
                setSosekData(prev => ({
                  ...prev,
                  hasilPertanian: [
                    ...prev.hasilPertanian,
                    hasilTani
                  ]
                }))
                setHasilTani(modelHasilTani)
                document.getElementById('jenis-tani').focus()
              }}
              className="border border-blue-300 bg-blue-300 hover:border-blue-400 hover:bg-blue-400 text-blue-600 focus:text-white px-2 py-1 focus:border-blue-600 active:bg-blue-600 focus:outline-none"
              >OK</button>
            )}
            </td>
          </tr>
        </tbody>)}
      </table>
      <BtnAdd flag={showTani} handler={() => {setShowTani(!showTani)}}/>


      <Subsection icon="🚴🏼‍♀️" text="hasil ternak per tahun" />
      <table className="tabular w-full bg-gray-50 text-xs">
        <thead>
          <tr className="bg-gray-100 text-gray-500 border-b">
            <th className="w-12 p-2 pl-6">&rarr;</th>
            <th width="" className="text-left border-l p-2">Jenis</th>
            <th width="" className="text-right border-l p-2">Luas</th>
            <th width="" className="text-right border-l p-2">Dikonsumsi</th>
            <th width="" className="text-left border-l p-2">Untuk</th>
            <th width="" className="text-right border-l p-2">Dijual</th>
            <th width="" className="text-right border-l p-2">Satuan</th>
            <th width="" className="text-right border-l p-2">Nilai</th>
            <th width="30" className="text-left border-l p-2 pr-6">&nbsp;</th>
          </tr>
        </thead>
        <tbody className="mapping">
          {sosekData.hasilTernak.map(({jenis, satuan, dikonsumsi, luas, untuk, dijual, nilai}, index) => (
          <tr key={`${jenis}-${nilai}`} className="border-b">
            <td className="w-12 p-2 pl-6">{index + 1}</td>
            <td width="20%" className="p-2 border-l">{jenis}</td>
            <td width="8%" className="p-2 border-l text-right whitespace-nowrap">{decimal(luas)}</td>
            <td width="8%" className="p-2 border-l text-right whitespace-nowrap">{decimal(dikonsumsi)}</td>
            <td width="20%" className="p-2 border-l">{untuk}</td>
            <td width="8%" className="p-2 border-l text-right whitespace-nowrap">{decimal(dijual)}</td>
            <td width="10%" className="p-2 border-l text-right whitespace-nowrap">{satuan}</td>
            <td width="10%" className="p-2 border-l text-right whitespace-nowrap"><span className="float-left mr-2 text-gray-300">Rp</span> {decimal(nilai)}</td>
            <td className="border-l td-action p-2 pr-6">
              <button value={index}
              onClick={e => {
                let array = [...sosekData.hasilTernak]
                array.splice(index, 1)
                setSosekData(prev => ({
                  ...prev,
                  hasilTernak: array
                }))
              }}
              className="rounded hover:bg-pink-100 text-gray-300 focus:outline-none px-2 py-1"
              >🗑</button>
            </td>
          </tr>
        ))}
        </tbody>
        {showTernak && (<tbody className="form">
          <tr className="border-b">
          <td className="p-2 text-right">&rarr;</td>
            <td className="form border-l p-2">
              <NestedInput autofocus={true} id="jenis-ternak"
              value={hasilAlam.jenis}
              isNumber={false}
              model={hasilAlam}
              nodes={['jenis']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.luas}
              isNumber={true}
              model={hasilAlam}
              nodes={['luas']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.dikonsumsi}
              isNumber={true}
              model={hasilAlam}
              nodes={['dikonsumsi']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.untuk}
              isNumber={false}
              model={hasilAlam}
              nodes={['untuk']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.dijual}
              isNumber={true}
              model={hasilAlam}
              nodes={['dijual']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.satuan}
              isNumber={false}
              model={hasilAlam}
              nodes={['satuan']}
              setter={setHasilAlam}
              style="w-full text-blue-500"
              />
            </td>
            <td className="form border-l p-2">
            <NestedInput
              value={hasilAlam.nilai}
              isNumber={true}
              model={hasilAlam}
              nodes={['nilai']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form whitespace-nowrap border-l p-2 pr-6">
            {!cekHasilAlam() && (
              <button disabled className="bg-gray-200 text-gray-300 px-2 py-1">OK</button>
            )}
            {cekHasilAlam() && (
              <button
              onClick={e => {
                setSosekData(prev => ({
                  ...prev,
                  hasilTernak: [
                    ...prev.hasilTernak,
                    hasilAlam
                  ]
                }))
                setHasilAlam (modelHasilAlam)
                document.getElementById('jenis-ternak').focus()
              }}
              className="border border-blue-300 bg-blue-300 hover:border-blue-400 hover:bg-blue-400 text-blue-600 focus:text-white px-2 py-1 focus:border-blue-600 active:bg-blue-600 focus:outline-none"
              >OK</button>
            )}
            </td>
          </tr>
        </tbody>)}
      </table>
      <BtnAdd flag={showTernak} handler={() => {setShowTernak(!showTernak)}}/>


      <Subsection icon="🚚" text="hasil budidaya ikan per tahun" />
      <table className="tabular w-full bg-gray-50 text-xs">
        <thead>
          <tr className="bg-gray-100 text-gray-500 border-b">
            <th className="w-12 p-2 pl-6">&rarr;</th>
            <th width="" className="text-left border-l p-2">Jenis</th>
            <th width="" className="text-right border-l p-2">Luas</th>
            <th width="" className="text-right border-l p-2">Dikonsumsi</th>
            <th width="" className="text-left border-l p-2">Untuk</th>
            <th width="" className="text-right border-l p-2">Dijual</th>
            <th width="" className="text-right border-l p-2">Satuan</th>
            <th width="" className="text-right border-l p-2">Nilai</th>
            <th width="30" className="text-left border-l p-2 pr-6">&nbsp;</th>
          </tr>
        </thead>
        <tbody className="mapping">
          {sosekData.hasilIkan.map(({jenis, satuan, dikonsumsi, dijual, luas, untuk, nilai}, index) => (
          <tr key={`${jenis}-${nilai}`} className="border-b">
            <td className="w-12 p-2 pl-6">{index + 1}</td>
            <td width="20%" className="border-l">{jenis}</td>
            <td width="8%" className="border-l text-right whitespace-nowrap p-2">{luas}</td>
            <td width="8%" className="border-l text-right whitespace-nowrap p-2">{decimal(dikonsumsi)}</td>
            <td width="20%" className="border-l">{untuk}</td>
            <td width="8%" className="border-l text-right whitespace-nowrap p-2">{decimal(dijual)}</td>
            <td width="10%" className="border-l text-right whitespace-nowrap p-2">{satuan}</td>
            <td width="10%" className="border-l text-right whitespace-nowrap p-2"><span className="float-left ml-2 text-gray-300">Rp</span> {decimal(nilai)}</td>
            <td className="border-l td-action p-2 pr-6">
              <button value={index}
              onClick={e => {
                let array = [...sosekData.hasilIkan]
                array.splice(index, 1)
                setSosekData(prev => ({
                  ...prev,
                  hasilIkan: array
                }))
              }}
              className="rounded hover:bg-pink-100 text-gray-300 focus:outline-none px-2 py-1"
              >🗑</button>
            </td>
          </tr>
        ))}
        </tbody>
        {showIkan && (<tbody className="form">
          <tr className="border-b">
          <td className="p-2 text-right">&rarr;</td>
            <td className="form border-l p-2">
              <NestedInput autofocus={true} id="jenis-ternak"
              value={hasilAlam.jenis}
              isNumber={false}
              model={hasilAlam}
              nodes={['jenis']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.luas}
              isNumber={true}
              model={hasilAlam}
              nodes={['luas']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.dikonsumsi}
              isNumber={true}
              model={hasilAlam}
              nodes={['dikonsumsi']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.untuk}
              isNumber={false}
              model={hasilAlam}
              nodes={['untuk']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
            <NestedInput
              value={hasilAlam.dijual}
              isNumber={true}
              model={hasilAlam}
              nodes={['dijual']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.satuan}
              isNumber={false}
              model={hasilAlam}
              nodes={['satuan']}
              setter={setHasilAlam}
              style="w-full text-blue-500"
              />
            </td>
            <td className="form border-l p-2">
            <NestedInput
              value={hasilAlam.nilai}
              isNumber={true}
              model={hasilAlam}
              nodes={['nilai']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form whitespace-nowrap border-l p-2 pr-6">
            {!cekHasilAlam() && (
              <button disabled className="bg-gray-200 text-gray-300 px-2 py-1">OK</button>
            )}
            {cekHasilAlam() && (
              <button
              onClick={e => {
                setSosekData(prev => ({
                  ...prev,
                  hasilIkan: [
                    ...prev.hasilIkan,
                    hasilAlam
                  ]
                }))
                setHasilAlam (modelHasilAlam)
                document.getElementById('jenis-ternak').focus()
              }}
              className="border border-blue-300 bg-blue-300 hover:border-blue-400 hover:bg-blue-400 text-blue-600 focus:text-white px-2 py-1 focus:border-blue-600 active:bg-blue-600 focus:outline-none"
              >OK</button>
            )}
            </td>
          </tr>
        </tbody>)}
      </table>
      <BtnAdd flag={showIkan} handler={() => {setShowIkan(!showIkan)}}/>



      <Subsection icon="🎋" text="hasil produk hutan per tahun" />
      <table className="tabular w-full bg-gray-50 text-xs">
        <thead>
          <tr className="bg-gray-100 text-gray-500 border-b ">
            <th className="w-12 p-2 pl-6">&rarr;</th>
            <th width="" className="text-left border-l p-2">Jenis</th>
            <th width="" className="text-right border-l p-2">Luas</th>
            <th width="" className="text-right border-l p-2">Dikonsumsi</th>
            <th width="" className="text-left border-l p-2">Untuk</th>
            <th width="" className="text-right border-l p-2">Dijual</th>
            <th width="" className="text-right border-l p-2">Satuan</th>
            <th width="" className="text-right border-l p-2">Nilai</th>
            <th width="30" className="text-left border-l p-2pr-6">&nbsp;</th>
          </tr>
        </thead>
        <tbody className="mapping">
          {sosekData.hasilHutan.map(({jenis, satuan, dikonsumsi, dijual, luas, untuk, nilai}, index) => (
          <tr key={`${jenis}-${nilai}`} className="border-b">
            <td>{index + 1}</td>
            <td width="20%" className="border-l">{jenis}</td>
            <td width="8%" className="border-l text-right whitespace-nowrap p-2">{luas}</td>
            <td width="8%" className="border-l text-right whitespace-nowrap p-2">{decimal(dikonsumsi)}</td>
            <td width="20%" className="border-l">{untuk}</td>
            <td width="8%" className="border-l text-right whitespace-nowrap p-2">{decimal(dijual)}</td>
            <td width="10%" className="border-l text-right whitespace-nowrap p-2">{satuan}</td>
            <td width="10%" className="border-l text-right whitespace-nowrap p-2"><span className="float-left ml-2 text-gray-300">Rp</span> {decimal(nilai)}</td>
            <td className="border-l td-action p-2 pr-6">
              <button value={index}
              onClick={e => {
                let array = [...sosekData.hasilHutan]
                array.splice(index, 1)
                setSosekData(prev => ({
                  ...prev,
                  hasilHutan: array
                }))
              }}
              className="rounded hover:bg-pink-100 text-gray-300 focus:outline-none px-2 py-1"
              >🗑</button>
            </td>
          </tr>
        ))}
        </tbody>
        {showHutan && (<tbody className="form">
          <tr className="border-b">
          <td className="p-2 text-right">&rarr;</td>
            <td className="form border-l p-2">
              <NestedInput autofocus={true} id="jenis-ternak"
              value={hasilAlam.jenis}
              isNumber={false}
              model={hasilAlam}
              nodes={['jenis']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.luas}
              isNumber={true}
              model={hasilAlam}
              nodes={['luas']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.dikonsumsi}
              isNumber={true}
              model={hasilAlam}
              nodes={['dikonsumsi']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.untuk}
              isNumber={false}
              model={hasilAlam}
              nodes={['untuk']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
            <NestedInput
              value={hasilAlam.dijual}
              isNumber={true}
              model={hasilAlam}
              nodes={['dijual']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.satuan}
              isNumber={false}
              model={hasilAlam}
              nodes={['satuan']}
              setter={setHasilAlam}
              style="w-full text-blue-500"
              />
            </td>
            <td className="form border-l p-2">
            <NestedInput
              value={hasilAlam.nilai}
              isNumber={true}
              model={hasilAlam}
              nodes={['nilai']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form whitespace-nowrap border-l p-2 pr-6">
            {!cekHasilAlam() && (
              <button disabled className="bg-gray-200 text-gray-300 px-2 py-1">OK</button>
            )}
            {cekHasilAlam() && (
              <button
              onClick={e => {
                setSosekData(prev => ({
                  ...prev,
                  hasilHutan: [
                    ...prev.hasilHutan,
                    hasilAlam
                  ]
                }))
                setHasilAlam (modelHasilAlam)
                document.getElementById('jenis-ternak').focus()
              }}
              className="border border-blue-300 bg-blue-300 hover:border-blue-400 hover:bg-blue-400 text-blue-600 focus:text-white px-2 py-1 focus:border-blue-600 active:bg-blue-600 focus:outline-none"
              >OK</button>
            )}
            </td>
          </tr>
        </tbody>)}
      </table>
      <BtnAdd flag={showHutan} handler={() => {setShowHutan(!showHutan)}}/>



      <Subsection icon="🐿" text="hasil berburu satwa per tahun" />
      <table className="tabular w-full bg-gray-50 text-xs">
        <thead>
          <tr className="bg-gray-100 text-gray-500 border-b">
            <th className="w-12 p-2 pl-6">&rarr;</th>
            <th width="" className="text-left border-l p-2">Jenis</th>
            <th width="" className="text-right border-l p-2">Luas</th>
            <th width="" className="text-right border-l p-2">Dikonsumsi</th>
            <th width="" className="text-left border-l p-2">Untuk</th>
            <th width="" className="text-right border-l p-2">Dijual</th>
            <th width="" className="text-right border-l p-2">Satuan</th>
            <th width="" className="text-right border-l p-2">Nilai</th>
            <th width="30" className="text-left border-l p-2 pr-6">&nbsp;</th>
          </tr>
        </thead>
        <tbody className="mapping">
          {sosekData.hasilSatwa.map(({jenis, satuan, dikonsumsi, luas, untuk, dijual, nilai}, index) => (
          <tr key={`${jenis}-${nilai}`} className="border-b">
            <td>{index + 1}</td>
            <td width="20%" className="border-l">{jenis}</td>
            <td width="8%" className="border-l text-right whitespace-nowrap">{luas}</td>
            <td width="8%" className="border-l text-right whitespace-nowrap">{decimal(dikonsumsi)}</td>
            <td width="20%" className="border-l">{untuk}</td>
            <td width="8%" className="border-l text-right whitespace-nowrap">{decimal(dijual)}</td>
            <td width="10%" className="border-l text-right whitespace-nowrap">{satuan}</td>
            <td width="10%" className="border-l text-right whitespace-nowrap"><span className="float-left ml-2 text-gray-300">Rp</span> {decimal(nilai)}</td>
            <td className="border-l td-action leading-nones">
              <button value={index}
              onClick={e => {
                let array = [...sosekData.hasilSatwa]
                array.splice(index, 1)
                setSosekData(prev => ({
                  ...prev,
                  hasilSatwa: array
                }))
              }}
              className="rounded hover:bg-pink-100 text-gray-300 focus:outline-none px-2 py-1"
              >🗑</button>
            </td>
          </tr>
        ))}
        </tbody>
        {showSatwa && (<tbody className="form">
          <tr className="border-b">
          <td className="p-2 text-right">&rarr;</td>
            <td className="form border-l p-2">
              <NestedInput autofocus={true} id="jenis-ternak"
              value={hasilAlam.jenis}
              isNumber={false}
              model={hasilAlam}
              nodes={['jenis']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.luas}
              isNumber={true}
              model={hasilAlam}
              nodes={['luas']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.dikonsumsi}
              isNumber={true}
              model={hasilAlam}
              nodes={['dikonsumsi']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.untuk}
              isNumber={false}
              model={hasilAlam}
              nodes={['untuk']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
            <NestedInput
              value={hasilAlam.dijual}
              isNumber={true}
              model={hasilAlam}
              nodes={['dijual']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form border-l p-2">
              <NestedInput
              value={hasilAlam.satuan}
              isNumber={false}
              model={hasilAlam}
              nodes={['satuan']}
              setter={setHasilAlam}
              style="w-full text-blue-500"
              />
            </td>
            <td className="form border-l p-2">
            <NestedInput
              value={hasilAlam.nilai}
              isNumber={true}
              model={hasilAlam}
              nodes={['nilai']}
              setter={setHasilAlam}
              style="w-full"
              />
            </td>
            <td className="form whitespace-nowrap border-l p-2 pr-6">
            {!cekHasilAlam() && (
              <button disabled className="bg-gray-200 text-gray-300 px-2 py-1">OK</button>
            )}
            {cekHasilAlam() && (
              <button
              onClick={e => {
                setSosekData(prev => ({
                  ...prev,
                  hasilSatwa: [
                    ...prev.hasilSatwa,
                    hasilAlam
                  ]
                }))
                setHasilAlam (modelHasilAlam)
                document.getElementById('jenis-ternak').focus()
              }}
              className="border border-blue-300 bg-blue-300 hover:border-blue-400 hover:bg-blue-400 text-blue-600 focus:text-white px-2 py-1 focus:border-blue-600 active:bg-blue-600 focus:outline-none"
              >OK</button>
            )}
            </td>
          </tr>
        </tbody>)}
      </table>
      <BtnAdd flag={showSatwa} handler={() => {setShowSatwa(!showSatwa)}}/>









      {/* debug */}
      {debug && (
      <div className="grid grid-cols-4 gap-0 border-b">
        <div className="px overflow-y-auto">
          <pre className="h-56">
            {JSON.stringify(sosekData.rumah, null, 2)}
            <br/>----------<br/>
            {JSON.stringify(sosekData.tanah, null, 2)}
          </pre>
        </div>
        <div className="border-l px overflow-y-auto">
          <pre className="h-56">
            {JSON.stringify(arrPendapatan, null, 2)}
            <br/>----------<br/>
            {JSON.stringify(sosekData.hasilPertanian, null, 2)}
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

      <style jsx>{`

      `}</style>



      <style jsx>{`
      .tabular td {
        padding-top:2px;
        padding-bottom: 2px;
      }
      .tabular td.form {
        padding-top: 4px;
        padding-bottom: 4px;
      }

      `}</style>


    </Layout>
  )
}

export default Aset