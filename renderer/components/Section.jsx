export default function Section({ text = 'Section Title' }) {
  return (
    <div className="w-full bg-white h-16 pt-6 pb-2 px-4 font-bold">
      <div className="bg-yellow-500s text-lg">{text}</div>
    </div>
  )
}