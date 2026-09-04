import { useState } from 'react'

const FILTERS = [
  { id: 'for-you', label: 'For you', icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
    ) },
  { id: 'new-here', label: 'New here', icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2L4.9 12.5H11L9.5 22l8.6-11.5H12L13 2z" /></svg>
    ) },
  { id: 'near-you', label: 'Near you', icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
    ) },
]

// Visual-only filters: selection is local state, nothing is fetched.
function FilterPills() {
  const [active, setActive] = useState('for-you')

  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-5 py-1">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => setActive(f.id)}
          aria-pressed={active === f.id}
          className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
            active === f.id
              ? 'bg-stone-950 text-white shadow-sm'
              : 'border border-stone-200 bg-white text-stone-700 hover:border-stone-300'
          }`}
        >
          {f.icon} {f.label}
        </button>
      ))}

      <button
        type="button"
        aria-label="Filters"
        className="grid size-10 shrink-0 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:border-stone-300"
      >
        <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M7 12h10M10 17h4" />
        </svg>
      </button>
    </div>
  )
}

export default FilterPills
