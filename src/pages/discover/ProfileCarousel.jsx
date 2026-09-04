import { useRef, useState } from 'react'
import ProfileCard from './ProfileCard'

const SWIPE_THRESHOLD = 70 // px of drag before a release changes cards

/**
 * Horizontal card carousel: active card centered, neighbours peeking at the
 * edges. Supports drag/swipe, edge chevrons, and an exit fling driven by the
 * parent (like / pass / super). Pure UI - navigation is local state.
 */
function ProfileCarousel({ profiles, index, onNavigate, exiting }) {
  const [drag, setDrag] = useState({ dx: 0, active: false })
  const start = useRef(null)

  const count = profiles.length
  const atEnd = index >= count // the "caught up" card

  const onPointerDown = (e) => {
    if (exiting) return
    start.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ dx: 0, active: true })
  }

  const onPointerMove = (e) => {
    if (start.current === null) return
    setDrag({ dx: e.clientX - start.current, active: true })
  }

  const onPointerUp = () => {
    if (start.current === null) return
    const { dx } = drag
    start.current = null
    setDrag({ dx: 0, active: false })
    if (dx < -SWIPE_THRESHOLD) onNavigate(index + 1)
    if (dx > SWIPE_THRESHOLD) onNavigate(index - 1)
  }

  return (
    <div className="relative h-full">
      {/* drag surface + cards */}
      <div
        className="relative h-full cursor-grab overflow-hidden active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {[...profiles, { id: '__end__', end: true }].map((profile, i) => {
          const offset = i - index
          if (Math.abs(offset) > 2) return null // only mount the neighbourhood

          const isActive = offset === 0
          const isExiting = isActive && exiting

          // exit fling wins; otherwise slot position + live drag delta
          const x = isExiting
            ? exiting.dir * 150
            : offset * 92
          const dragPx = isActive || drag.active ? drag.dx : 0
          const rotate = isExiting ? exiting.dir * 12 : dragPx / 30
          const scale = isExiting ? 0.9 : isActive ? 1 : 0.9

          return (
            <div
              key={profile.id}
              aria-hidden={!isActive}
              className={`absolute inset-y-0 left-1/2 w-[min(88vw,400px)] ${
                drag.active ? '' : 'transition-all duration-[380ms] ease-[cubic-bezier(0.22,0.9,0.3,1)]'
              }`}
              style={{
                transform: `translateX(calc(-50% + ${x}% + ${dragPx}px)) scale(${scale}) rotate(${rotate}deg)`,
                opacity: isExiting ? 0 : 1,
                zIndex: isActive ? 10 : 5 - Math.abs(offset),
              }}
            >
              {profile.end ? (
                <div className="grid h-full w-full place-items-center rounded-[2rem] border border-dashed border-stone-300 bg-white/70 p-8 text-center">
                  <div>
                    <p className="text-3xl" aria-hidden="true">✦</p>
                    <p className="mt-3 text-lg font-bold tracking-tight text-stone-900">
                      You&apos;re all caught up
                    </p>
                    <p className="mt-1.5 text-sm text-stone-500">
                      New people join every day. Check back soon.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <ProfileCard profile={profile} active={isActive} />
                  {/* dim the neighbours so the active card owns the eye */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 rounded-[2rem] bg-stone-950 transition-opacity duration-[380ms] ${
                      isActive ? 'opacity-0' : 'opacity-35'
                    }`}
                  />
                  {/* action stamp while a card flings out */}
                  {isExiting && (
                    <div className="absolute inset-0 grid place-items-center">
                      <span className={`grid size-24 place-items-center rounded-full text-white shadow-2xl ${
                        exiting.type === 'pass' ? 'bg-stone-900/90' : 'bg-violet-500/95'
                      }`}>
                        {exiting.type === 'pass' ? (
                          <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                        ) : exiting.type === 'super' ? (
                          <svg viewBox="0 0 24 24" className="size-10" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17l-6.2 3.9 1.6-7L2 9.2l7.1-.6L12 2z" /></svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="size-10" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        )}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* edge chevrons */}
      <button
        type="button"
        aria-label="Previous profile"
        onClick={() => onNavigate(index - 1)}
        disabled={index === 0 || !!exiting}
        className="absolute left-1.5 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-stone-700 shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-0"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button
        type="button"
        aria-label="Next profile"
        onClick={() => onNavigate(index + 1)}
        disabled={atEnd || !!exiting}
        className="absolute right-1.5 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-stone-700 shadow-lg transition hover:scale-105 disabled:pointer-events-none disabled:opacity-0"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
      </button>
    </div>
  )
}

export default ProfileCarousel
