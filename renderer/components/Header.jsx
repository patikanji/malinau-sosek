const Header = ({ title, user }) => {
  const hTitle = title ? title : 'Sosek Mentarang'
  const owner = user?.name ? user.name : ''

  return (
    <>
      <div className="antialiased text-sm text-gray-700">
        <div className="flex flex-row items-center h-11 bg-gray-800 px-4 py-2">
          <div className="flex-grow">
            <h1 className="text-lg text-gray-500">{hTitle}</h1>
          </div>
          <div className="flex-0 text-xs">
            <p className="text-gray-400 font-ssemibold tracking-wider uppercase">{owner}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header