// import Donut from "./Donut"

const Subsection = ({ icon = "🥦", text = "Subsection" }) => {

  return (
    <div className="w-full bg-white border-b pt-8 pb-1 px-4">
      <div className="flex flex-row items-center bg-white">
        <div className="text-3xl pr-2">{icon}</div>
        <p className="flex-grow text-sm text-indigo-400 tracking-wider uppercase">{text}</p>
        {/* <Donut/> */}
      </div>
    </div>
  )
}

export default Subsection