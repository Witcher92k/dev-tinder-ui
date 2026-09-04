const ITEMS = [
  { id: 'discover', label: 'Discover', badge: 0, icon: (
      <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="12" height="16" rx="2.5" transform="rotate(-6 9 12)" />
        <rect x="9" y="4" width="12" height="16" rx="2.5" transform="rotate(6 15 12)" />
      </svg>
    ) },
  { id: 'likes', label: 'Likes', badge: 12, icon: (
      <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20.5l-1.3-1.2C6 15 3 12.2 3 8.9 3 6.2 5.1 4 7.8 4c1.5 0 3 .7 4.2 1.9C13.2 4.7 14.7 4 16.2 4 18.9 4 21 6.2 21 8.9c0 3.3-3 6.1-7.7 10.4L12 20.5z" />
      </svg>
    ) },
  { id: 'matches', label: 'Matches', badge: 0, icon: (
      <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 12a5 5 0 118-4" /><path d="M16 12a5 5 0 11-8 4" />
      </svg>
    ) },
  { id: 'chats', label: 'Chats', badge: 3, icon: (
      <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a8 8 0 01-11.6 7.1L4 21l1.9-5.4A8 8 0 1121 12z" />
        <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" strokeWidth="2.4" />
      </svg>
    ) },
  { id: 'profile', label: 'Profile', badge: 0, icon: (
      <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0114 0" />
      </svg>
    ) },
]

// Static shell - only Discover exists, so the rest are inert.
function BottomNavigation({ active = 'discover' }) {
  return (
    <nav aria-label="Main" className="rounded-[1.75rem] bg-stone-950 px-3 py-2.5 shadow-2xl shadow-stone-900/30">
      <ul className="flex items-center justify-between">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              aria-current={active === item.id ? 'page' : undefined}
              className={`relative flex w-15 flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-medium transition ${
                active === item.id ? 'text-white' : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              {item.icon}
              {item.label}
              {item.badge > 0 && (
                <span className="absolute -top-0.5 right-2 grid min-w-4.5 place-items-center rounded-full bg-violet-500 px-1 py-px text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default BottomNavigation
