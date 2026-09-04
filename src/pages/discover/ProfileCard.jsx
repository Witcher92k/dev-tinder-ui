// Presentational card - everything the reference shows on one profile.
function ProfileCard({ profile, active }) {
  const {
    name, age, profession, location, photoUrl, verified, isNew,
    online, vibeMatch, prompts, interests, extraInterests,
  } = profile

  return (
    <article className="relative h-full w-full overflow-hidden rounded-[2rem] bg-stone-900 shadow-xl shadow-stone-900/20">
      <img
        src={photoUrl}
        alt={`${name}, ${age}`}
        draggable={false}
        className="h-full w-full select-none object-cover"
      />

      {/* readability scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
      />

      {/* top row: badges */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
        {isNew ? (
          <span className="flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <span className="text-violet-300">✦</span> New here
          </span>
        ) : <span />}

        <div className="flex items-center gap-2">
          {verified && (
            <span
              title="Verified"
              className="grid size-8 place-items-center rounded-full bg-violet-500 text-white shadow-md"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
          )}
          <button
            type="button"
            aria-label="More options"
            className="grid size-8 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
              <circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" />
            </svg>
          </button>
        </div>
      </div>

      {/* voice prompt - decorative, no audio wired up */}
      <button
        type="button"
        aria-label={`Play ${name}'s voice prompt`}
        tabIndex={active ? 0 : -1}
        className="absolute bottom-[13.5rem] right-4 grid size-12 place-items-center rounded-full bg-black/35 text-white ring-2 ring-violet-400 backdrop-blur-md transition hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4z" />
          <path d="M16.5 8.5a5 5 0 010 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* bottom content */}
      <div className="absolute inset-x-0 bottom-0 space-y-3 p-4">
        <div>
          <h2 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight text-white">
            {name}, {age}
            {online && <span className="size-2.5 rounded-full bg-emerald-400" aria-label="Online" />}
          </h2>
          <p className="mt-1 text-sm font-medium text-white/85">
            {profession} <span className="text-white/50">·</span> {location}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
          <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {vibeMatch}% vibe match
        </span>

        {/* personality prompts */}
        <div className="grid grid-cols-2 gap-2.5">
          {prompts.slice(0, 2).map((prompt, idx) => (
            <div
              key={prompt.title}
              className={`rounded-2xl p-3.5 ${
                idx === 0
                  ? 'bg-stone-950/85 text-white backdrop-blur-sm'
                  : 'bg-[#f6f1ea]/95 text-stone-900'
              }`}
            >
              <p className={`text-[11px] font-medium ${idx === 0 ? 'text-white/60' : 'text-stone-500'}`}>
                {prompt.title}
              </p>
              <p className="mt-1 text-sm font-semibold leading-snug">{prompt.answer}</p>
            </div>
          ))}
        </div>

        {/* interests */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          {interests.map((interest) => (
            <span
              key={interest.label}
              className="flex shrink-0 items-center gap-1 rounded-full bg-black/45 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md"
            >
              <span aria-hidden="true">{interest.icon}</span> {interest.label}
            </span>
          ))}
          {extraInterests > 0 && (
            <span className="shrink-0 rounded-full bg-black/45 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
              +{extraInterests}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProfileCard
