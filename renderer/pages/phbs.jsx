import electron from 'electron'
import Layout from "../components/Layout"
import { useState, useEffect } from 'react'
import Section from "../components/Section"
import { useRouter } from 'next/router'
import { getDataFromJsonFile, decimal } from '../lib/utils'
import Hero from '../components/Hero'
import Donut from '../components/Donut'
import Select from '../components/Select'
import Lanjut from '../components/Lanjut'

const ipcRenderer = electron.ipcRenderer || false
// const dataDir = ipcRenderer.sendSync('get-data-dir')
// const user = ipcRenderer.sendSync('get-user') || { name: 'ERROR' }

/*
* air yang sumbernya berjarak minimal 10m dari pembuangan kotoran, tidak berwarna, tidak bau dan tidak berasa.
*/
const phbs = [
  [ 'persalinan',
    'Oleh siapa biasanya pertolongan persalinan dilakukan?',
  [ 'Tenaga kesehatan (bidan/dokter)', 'Non-tenaga kesehatan (dukun bayi)'],
  ],
  [ 'asi',
    'Apakah setelah melahirkan si bayi diberikan ASI eksklusif selama 6 bulan? ',
     ['Ya', 'Tidak'],
  ],
  [ 'rawatBayi',
    'Apakah Bayi/Balita selalu ditimbang di fasilitas kesehatan setiap bulan selama tiga bulan terakhir?',
     ['Ya', 'Tidak'],
  ],
  [ 'rawatBayiInfo',
    'Apakah I/B/S menggunakan air bersih* untuk kegiatan sehari-hari?',
  [ 'Tenaga kesehatan (bidan/dokter)', 'Non-tenaga kesehatan (dukun bayi)'],
  ],
  [ 'airBersih',
    'Kebiasaan mencuci tangan dengan sabun setelah melakukan aktifitas?',
     ['Ya', 'Tidak'],
  ],
  [ 'cuciTangan',
    'Apakah Anda dan keluarga menggunakan jamban/ WC yang bersih milik pribadi/komunal/milik tetangga?',
     ['Ya', 'Tidak'],
  ],
  [ 'nyamuk3m',
    'Apakah keluarga rutin melakukan pemberantasan jentik nyamuk di lingkungan rumah?',
     ['Ya', 'Tidak'],
  ],
  [ 'bersayur',
    'Apakah anggota keluarga rutin mengkonsumsi sayur dan buah?',
     ['Setiap hari', 'Kadang-kadang', 'Sangat jarang', 'Tidak pernah'],
  ],
  [ 'olahraga',
    'Apakah anggota keluarga rutin berolahraga?',
     ['Setiap hari', 'Kadang-kadang', 'Sangat jarang', 'Tidak pernah'],
  ],
  [ 'merokok',
    'Apakah ada anggota rumah tangga yang merokok di dalam rumah?',
     ['Ada', 'Tidak ada'],
  ],
]

const observasi = [
  [ 'observasiLangit',
    'Langit-langit',
    [
      'Bersih',
      'Kotor, sulit dibersihkan dan rawan kecelakaan',
      'Tidak ada'
    ],
  ],
  [ 'observasiDinding',
    'Dinding rumah',
    [
      'Semi permanen / tanpa plester / papan tidak kedap air',
      'Permanen / dengan plester / papan kedap air',
      'Bukan tembok (terbuat dari anyaman bambu/papan)',
    ],
  ],
  [ 'observasiLantai',
    'Lantai',
    [
      'Papan dekat tanah, plesteran retak dan berdebu',
      'Diplester/ubin/keramik/papan (rumah panggung)',
      'Tanah'
    ],
  ],
  [ 'observasiJendelaKamar',
    'Jendela kamar tidur',
    [
      'Semua ada', 'Sebagian ada', 'Tidak ada',
    ],
  ],
  [ 'observasiJendelaRuang',
    'Jendela ruang keluarga',
    [
      'Semua ada', 'Sebagian ada', 'Tidak ada',
    ],
  ],
  [ 'observasiVentilasi',
    'Ventilasi',
    [
      'Lebih besar atau sama dengan 10% luas lantai',
      'Sebagian Ruangan tanpa ventilasi / kurang dari 10% luas lantai',
      'Tidak ada',
    ],
  ],
  [ 'observasiPencahayaan',
    'Pencahayaan',
    [
      'Tidak terang (tidak dapat digunakan untuk membaca)',
      'Kurang terang, tidak nyaman untuk membaca dengan normal',
      'Terang, tidak silau, nyaman untuk membaca'
    ],
  ],
  [ 'observasiAsap',
    'Pembuangan asap dapur',
    [
      'Lubang Ventilasi dapur lbh besar atau sama dengan 10% Luas lantai',
      'Tidak ada'
    ],
  ],
  [ 'observasiKepadatan',
    'Kepadatan penghuni',
    [
      'Ruang tidur lebih 8 meter digunakan untuk tidur oleh 2 orang',
      'Ruang tidur kurang dari 8 meter untuk lebih dari 2 orang'
    ],
  ]
]


const PHBS = () => {
  const router = useRouter()
  const rsid = router.query['id']
  const dataDir = getDataDir()
  const resdata = rsid ? getDataFromJsonFile(dataDir, rsid) : false

  if (!resdata) return <h1>ERROR</h1>

  let config = {
    title: 'Perilaku Hidup Sehat',
    back: '/kesehatan?id=' + resdata.id,
    next: '/persepsi?id=' + resdata.id,
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
                  {phbs.map(([key, text, opt], index) => (
                  <tr key={`phbs-${key}`} className="border-t">
                    <td className="w-1/2 align-top pl-7 py-3">
                      {text}
                    </td>
                    <td className="align-top pl-4 pr-7 py-3">
                      <Select optionType="FLAT"
                        disabled={locked}
                        options={opt}
                        model={sosekCopy}
                        field={key}
                        setter={setSosekData}
                      />
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
              <table className="w-full">
                <tbody>
                  <tr className="border-t">
                    <td colSpan="2" className="align-top pl-7 py-3 text-base font-bold">
                      Observasi Rumah Sehat
                    </td>
                  </tr>
                  {observasi.map(([key, text, opt], index) => (
                  <tr key={`phbs-${key}`} className="border-t">
                    <td className="w-1/2 align-top pl-7 py-3">
                      {text}
                    </td>
                    <td className="align-top pl-4 pr-7 py-3">
                      <Select optionType="FLAT"
                        disabled={locked}
                        options={opt}
                        model={sosekCopy}
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

      <Lanjut/>
    </Layout>
  )
}

export default PHBS