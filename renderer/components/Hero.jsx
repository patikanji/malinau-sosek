const Hero = ({ title = 'Untitled', ribbon = ''  }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white antialiased px-4 pt-6">
      <div className="flex flex-row items-end pt-1 pb-3">
        <p className="flex-grow text-3xl text-purple-400 font-light leading-4s">{title}</p>
        <p className="text-sm pb-1">
          <span>&nbsp;</span>
        </p>
      </div>
      <pre className="bg-purple-300 text-xs uppercase text-white -mx-4 px-4 py-1">&rarr; {ribbon}</pre>
    </div>
  )
}

export default Hero