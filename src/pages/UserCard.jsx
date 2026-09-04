export const UserCard = ({ firstName, lastName, photoUrl, age, about, skills }) => {

  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-stone-900 shadow-xl shadow-stone-900/15 ring-1 ring-stone-900/5">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="grid aspect-[4/5] w-full place-items-center bg-gradient-to-br from-stone-700 to-stone-900 text-6xl font-semibold text-white/90">
          {initials}
        </div>
      )}

      {/* readable text over any photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          {firstName} {lastName}
          {age != null && <span className="font-normal text-white/90">, {age}</span>}
        </h2>

        {about && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/80">
            {about}
          </p>
        )}

        {skills?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default UserCard;
