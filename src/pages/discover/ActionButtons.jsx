const btnBase =
  'grid place-items-center rounded-full shadow-lg shadow-stone-900/10 transition hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40'

// Rewind / Pass / Like / Super - all local UI callbacks, no requests.
function ActionButtons({ onRewind, onPass, onLike, onSuper, canRewind, canAct }) {
  return (
    <div className="px-5">
      <div className="flex items-center justify-center gap-4">
        <button type="button" aria-label="Rewind" onClick={onRewind} disabled={!canRewind}
          className={`${btnBase} size-13 bg-white text-violet-500`}>
          <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 109-9" /><path d="M3 4v5h5" />
          </svg>
        </button>

        <button type="button" aria-label="Pass" onClick={onPass} disabled={!canAct}
          className={`${btnBase} size-15 bg-white text-stone-900`}>
          <svg viewBox="0 0 24 24" className="size-6.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <button type="button" aria-label="Like" onClick={onLike} disabled={!canAct}
          className={`${btnBase} size-18 bg-violet-500 text-white shadow-violet-500/40 hover:bg-violet-600`}>
          <svg viewBox="0 0 24 24" className="size-8" fill="currentColor" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        <button type="button" aria-label="Super like" onClick={onSuper} disabled={!canAct}
          className={`${btnBase} size-13 bg-white text-stone-900`}>
          <svg viewBox="0 0 24 24" className="size-5.5" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17l-6.2 3.9 1.6-7L2 9.2l7.1-.6L12 2z" />
          </svg>
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-stone-500">
        <span className="text-violet-500" aria-hidden="true">✦ </span>
        Say hi with a <span className="font-semibold text-violet-600">vibe</span>, not just a like.
      </p>
    </div>
  )
}

export default ActionButtons
