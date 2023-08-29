export const Profile = ({
  className,
  imageClasses
}: {
  className?: string
  imageClasses?: string
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-xl p-4 ${className}`}>
      <img
        src="/img/profile.jpg"
        className={`rounded-xl ${imageClasses}`}
        alt="Adam Laycock"
      />
      <h1 className="text-2xl">Adam Laycock</h1>
      <h2>EdTech Network Manager</h2>
      <ul className="flex gap-2">
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/uses">Uses</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </div>
  )
}
