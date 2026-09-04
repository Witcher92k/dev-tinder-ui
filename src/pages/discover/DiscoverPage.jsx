import { useRef, useState } from 'react'
import { profiles } from './mockProfiles'
import FilterPills from './FilterPills'
import ProfileCarousel from './ProfileCarousel'
import ActionButtons from './ActionButtons'
import BottomNavigation from './BottomNavigation'

const EXIT_MS = 380 // keep in sync with the carousel's transition duration

// Discover screen: pure UI over mock data. Like/pass/super only advance the
// local carousel - nothing is sent anywhere.
function DiscoverPage() {
  const [index, setIndex] = useState(0)
  const [exiting, setExiting] = useState(null) // { type, dir } while a card flings out
  const timer = useRef(null)

  const atEnd = index >= profiles.length

  const goTo = (next) => {
    if (exiting) return
    setIndex(Math.max(0, Math.min(profiles.length, next)))
  }

  // fling the active card out, then land on the next one
  const act = (type) => {
    if (exiting || atEnd) return
    setExiting({ type, dir: type === 'pass' ? -1 : 1 })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setExiting(null)
      setIndex((i) => Math.min(profiles.length, i + 1))
    }, EXIT_MS)
  }

  return (
    <div className="min-h-svh bg-[#f4f0ea] text-stone-900">
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col pb-4">

        {/* header */}
        <header className="flex items-center justify-between px-5 pt-6">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Discover <span className="text-lg text-violet-500" aria-hidden="true">✦</span>
          </h1>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-stone-950 py-2.5 pl-3.5 pr-4 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800"
          >
            <svg viewBox="0 0 24 24" className="size-4 text-amber-300" fill="currentColor" aria-hidden="true">
              <path d="M3 8l4.5 3L12 5l4.5 6L21 8l-1.5 9h-15L3 8z" />
            </svg>
            Premium
          </button>
        </header>

        {/* filter pills */}
        <div className="mt-4">
          <FilterPills />
        </div>

        {/* carousel */}
        <main className="mt-3 h-[min(56svh,560px)] min-h-100">
          <ProfileCarousel
            profiles={profiles}
            index={index}
            onNavigate={goTo}
            exiting={exiting}
          />
        </main>

        {/* actions */}
        <div className="mt-4">
          <ActionButtons
            onRewind={() => goTo(index - 1)}
            onPass={() => act('pass')}
            onLike={() => act('like')}
            onSuper={() => act('super')}
            canRewind={index > 0 && !exiting}
            canAct={!atEnd && !exiting}
          />
        </div>

        {/* bottom navigation */}
        <div className="sticky bottom-3 mt-5 px-4">
          <BottomNavigation active="discover" />
        </div>
      </div>
    </div>
  )
}

export default DiscoverPage
