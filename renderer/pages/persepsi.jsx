import electron from 'electron'
import Layout from "../components/Layout"
import { useState, useEffect } from 'react'
import Section from "../components/Section"
import { useRouter } from 'next/router'
import { getDataFromJsonFile, decimal } from '../lib/utils'
import Hero from '../components/Hero'
import Donut from '../components/Donut'
import Select from '../components/Select'
import NestedInput from '../components/NestedInput'

const ipcRenderer = electron.ipcRenderer || false
// const dataDir = ipcRenderer.sendSync('get-data-dir')
// const user = ipcRenderer.sendSync('get-user') || { name: 'ERROR' }

const psModel = [
  ['psKonsen', 'psKonsenInfo', 'Tentang rencana pembangunan PLTA Mentarang:'],
  ['psEkonomiLokal', 'psEkonomiLokalInfo', 'Pengaruh proyek terhadap perekonomian lokal:'],
  ['psLapanganKerja', 'psLapanganKerjaInfo', 'Pengaruh proyek terhadap lapangan pekerjaan lokal:'],
  ['psLingkungan', 'psLingkunganInfo', 'Pengaruh proyek terhadap lingkungan:'],
  ['psKesmas', 'psKesmasInfo', 'Pengaruh proyek terhadap kesehatan masyarakat:'],
  ['psKepekaan', 'psKepekaanInfo', 'Pengaruh proyek terhadap kepekaan sosial:'],
  ['psInfrastruktur', 'psInfrastrukturInfo', 'Pengaruh proyek terhadap infrastruktur masyarakat lokal:'],
  ['psAdat', 'psAdatInfo', 'Keberlakuan adat istiadat oleh masyarakat:'],
  ['psGotongRoyong', 'psGotongRoyongInfo', 'Pelaksanaan gotong royong dan pertemuan masyarakat:'],
  ['psSikap', 'psSikapInfo', 'Sikap terhadap Rencana PLTA Mentarang:'],
]

const psOptions = {
  psKonsen: ['Sudah tahu','Tidak/belum tahu'],
  psEkonomiLokal: ['Meningkat', 'Memburuk', 'Sama saja', 'Tidak tahu'],
  psLapanganKerja: ['Lebih banyak untuk tenaga lokal', 'Lebih sedikit untuk tenaga lokal', 'Lebih banyak untuk nasional', 'Tidak tahu'],
  psLingkungan: ['Kualitas meningkat', 'Kualitas memburuk', 'Tidak berdampak signifikan', 'Tidak tahu'],
  psKesmas: ['Kesehatan meningkat', 'Kesehatan memburuk', 'Tidak berdampak signifikan', 'Tidak tahu'],
  psKepekaan: ['Kepekaan membaik', 'Kepekaan memburuk', 'Tidak berdampak signifikan', 'Tidak tahu'],
  psInfrastruktur: ['Kualitas meningkat', 'Kualitas memburuk', 'Tidak berdampak signifikan', 'Tidak tahu'],
  psAdat: ['Masih dilaksanakan', 'Sudah tidak dilaksanakan', 'Tidak tahu'],
  psGotongRoyong: ['Masih dilaksanakan', 'Sudah tidak dilaksanakan', 'Tidak tahu'],
  psSikap: ['Mendukung', 'Tidak mendukung', 'Terserah pemerintah'],
}


const Persepsi = () => {
  const router = useRouter()
  const rsid = router.query['id']
  const dataDir = getDataDir()
  const resdata = rsid ? getDataFromJsonFile(dataDir, rsid) : false

  if (!resdata) return <h1>ERROR</h1>

  let config = {
    title: 'Persepsi Seputar Proyek',
    back: '/phbs?id=' + resdata.id,
    next: '/responden?id=' + resdata.id,
    footer: true,
    user: getUser(),
    ribbon: 'Desa ' + resdata.desa,
  }

  const [sosekData, setSosekData] = useState(resdata)
  const [sosekCopy, setSosekCopy] = useState(resdata)
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

  useEffect(() => {
    ipcRenderer.sendSync('save-responden', sosekData)
  }, [sosekData])

  function handleBerobat(e) {
    if (e.currentTarget.checked) {
      setArrBerobat(prev => [
        ...prev, e.target.value
      ]);

      setSosekData(prev => ({
        ...prev,
        tempatBerobat: [
          ...prev.tempatBerobat,
          e.target.value
        ]
      }))
    } else {
      const newArr = arrBerobat.filter((item) => item !== e.target.value);
      setArrBerobat(newArr);
      setSosekData(prev => ({
        ...prev,
        tempatBerobat: newArr
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
                    <td colSpan="2" className="align-top pl-7 pb-4">
                      Untuk setiap pertanyaan, tentukan pilihan serta tuliskan alasan/komentar responden.
                    </td>
                  </tr>

                  <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>

                 {psModel.map((arr, index) => (
                    <>
                    {index > 0 && <tr className="border-t"><td colSpan="2">&nbsp;</td></tr>}
                    <tr key={`Key${index}`}>
                      <td className="w-48 align-top pl-7 pr-4 pt-s2">{arr[2]}</td>
                      <td className="pb-4 pr-8">
                        <p className="mb-2">
                          <Select optionType="FLAT"
                            disabled={locked}
                            options={psOptions[arr[0]]}
                            model={sosekCopy}
                            field={arr[0]}
                            setter={setSosekData}
                          />
                        </p>
                        <p>
                          <NestedInput style="w-full"
                            disabled={locked}
                            value={sosekCopy[arr[1]]}
                            model={sosekCopy}
                            nodes={[arr[1]]}
                            setter={setSosekCopy}
                            proxy={setSosekData}
                          />
                        </p>
                      </td>
                    </tr>
                    </>
                    ))}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <p className="text-3xl text-center text-gray-300 tracking-widest my-8">SELESAI</p>

    </Layout>
  )
}

export default Persepsi