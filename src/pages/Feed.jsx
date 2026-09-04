import { useEffect, useState } from 'react'
import axios from 'axios'
import { UserCard } from './UserCard'
import { BASE_URL } from '../utils/constants';

// Defined outside Feed - a component declared inside another is a new type
// on every render, which remounts its subtree.
const Placeholder = ({ children }) => (
    <div className="mt-10 grid min-h-80 place-items-center rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 text-center">
        {children}
    </div>
)

const ArrowButton = ({ dir, onClick, disabled, className = '' }) => (
    <button
        type="button"
        aria-label={dir === 'prev' ? 'Previous profile' : 'Next profile'}
        onClick={onClick}
        disabled={disabled}
        className={`size-12 place-items-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-md transition hover:scale-105 hover:text-stone-900 hover:shadow-lg disabled:pointer-events-none disabled:opacity-30 ${className}`}
    >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {dir === 'prev' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
        </svg>
    </button>
)

const Feed = () => {

    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState('next');

    const getUserList = async () => {

        try {
            setError(null);

            const res = await axios.get(`${BASE_URL}/connection/request/feed`,
                { withCredentials: true }
            )

            setUserList(res.data.data);

        }

        catch (err) {
            // Surface the reason instead of rendering an indistinguishable blank.
            setError(err?.response?.data || err.message);
            setUserList([]);
        }

        finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        const timer = window.setTimeout(getUserList, 0);
        return () => window.clearTimeout(timer);
    }, [])

    const goTo = (next) => {
        if (next < 0 || next >= userList.length) return
        setDirection(next > index ? 'next' : 'prev')
        setIndex(next)
    }

    // arrow-key navigation
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const next = index + 1
                if (next < userList.length) {
                    setDirection('next')
                    setIndex(next)
                }
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const next = index - 1
                if (next >= 0) {
                    setDirection('prev')
                    setIndex(next)
                }
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [index, userList])

    // fetch the neighbours' photos ahead of time so paging never flashes
    useEffect(() => {
        [userList[index + 1], userList[index - 1]].forEach((u) => {
            if (u?.photoUrl) {
                const img = new Image()
                img.src = u.photoUrl
            }
        })
    }, [index, userList])

    if (loading) {
        return (
            <div className="mx-auto mt-10 w-full max-w-md animate-pulse">
                <div className="h-1 rounded-full bg-stone-200" />
                <div className="mt-4 aspect-[4/5] rounded-3xl bg-stone-200" />
            </div>
        )
    }

    if (error) {
        return (
            <Placeholder>
                <div>
                <p className="text-sm font-medium text-rose-600">
                    Couldn&apos;t load your feed
                </p>
                <p className="mt-1 text-sm text-stone-500">{String(error)}</p>
                <button
                    onClick={getUserList}
                    className="btn mt-4 h-9 rounded-full border-none bg-stone-900 px-4 text-sm font-medium text-white hover:bg-stone-800"
                >
                    Try again
                </button>
                </div>
            </Placeholder>
        )
    }

    if (userList.length === 0) {
        return (
            <Placeholder>
                <div>
                <p className="text-sm font-medium text-stone-700">No one left to show</p>
                <p className="mt-1 text-sm text-stone-500">
                    You&apos;ve seen everyone you haven&apos;t already connected with.
                </p>
                </div>
            </Placeholder>
        )
    }

    const current = userList[index]

    return (
        <div className="mx-auto mt-10 w-full max-w-md">

            {/* progress */}
            <div className="flex items-center gap-3">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-stone-200">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-violet-500 transition-all duration-300"
                        style={{ width: `${((index + 1) / userList.length) * 100}%` }}
                    />
                </div>
                <span className="text-xs font-medium tabular-nums text-stone-400">
                    {index + 1} / {userList.length}
                </span>
            </div>

            <div className="relative mt-6">
                {/* stacked-deck layers peeking out under the card */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -rotate-2 rounded-3xl bg-white shadow-sm ring-1 ring-stone-200"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 rotate-[1.3deg] rounded-3xl bg-stone-100 ring-1 ring-stone-200"
                />

                {/* keyed by user so each page change re-runs the enter animation */}
                <div key={current._id} className={`relative ${direction === 'next' ? 'card-enter-next' : 'card-enter-prev'}`}>
                    <UserCard
                        firstName={current.firstName}
                        lastName={current.lastName}
                        photoUrl={current.photoUrl}
                        age={current.age}
                        about={current.about}
                        skills={current.skills}
                    />
                </div>

                {/* desktop: arrows flank the card */}
                <ArrowButton dir="prev" onClick={() => goTo(index - 1)} disabled={index === 0}
                    className="absolute -left-20 top-1/2 hidden -translate-y-1/2 lg:grid" />
                <ArrowButton dir="next" onClick={() => goTo(index + 1)} disabled={index === userList.length - 1}
                    className="absolute -right-20 top-1/2 hidden -translate-y-1/2 lg:grid" />
            </div>

            {/* mobile: controls under the card */}
            <div className="mt-6 flex items-center justify-center gap-6 lg:hidden">
                <ArrowButton dir="prev" onClick={() => goTo(index - 1)} disabled={index === 0} className="grid" />
                <ArrowButton dir="next" onClick={() => goTo(index + 1)} disabled={index === userList.length - 1} className="grid" />
            </div>

            <p className="mt-6 hidden text-center text-xs text-stone-400 lg:block">
                Tip: use ← → arrow keys to browse
            </p>
        </div>
    )
}

export default Feed
