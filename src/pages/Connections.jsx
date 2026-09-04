import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addConnection } from '../utils/connectionSlice'
import { BASE_URL } from '../utils/constants';

// Defined outside Connections - a component declared inside another is a new
// type on every render, which remounts its subtree.
const Placeholder = ({ children }) => (
    <div className="mt-10 grid min-h-80 place-items-center rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 text-center">
        {children}
    </div>
)

const Avatar = ({ firstName, lastName, photoUrl }) => {
    const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()

    return photoUrl ? (
        <img
            src={photoUrl}
            alt={`${firstName} ${lastName}`}
            loading="lazy"
            className="size-20 shrink-0 rounded-2xl object-cover ring-1 ring-stone-900/10 sm:size-24"
        />
    ) : (
        <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-stone-700 to-stone-900 text-2xl font-semibold text-white/90 sm:size-24">
            {initials}
        </div>
    )
}

const ConnectionCard = ({ user }) => {
    const { firstName, lastName, age, gender, about, skills } = user

    return (
        <li className="group flex items-center gap-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-900/5 sm:p-5">
            <Avatar {...user} />

            <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                    <h2 className="truncate text-lg font-semibold tracking-tight text-stone-900">
                        {firstName} {lastName}
                    </h2>
                    {age != null && (
                        <span className="text-sm text-stone-500">
                            {age}{gender ? ` · ${gender}` : ''}
                        </span>
                    )}
                </div>

                {about && (
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-stone-500">
                        {about}
                    </p>
                )}

                {skills?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {skills.slice(0, 4).map((skill) => (
                            <span
                                key={skill}
                                className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 ring-1 ring-stone-200"
                            >
                                {skill}
                            </span>
                        ))}
                        {skills.length > 4 && (
                            <span className="rounded-full px-1.5 py-0.5 text-xs font-medium text-stone-400">
                                +{skills.length - 4} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            <button
                type="button"
                className="hidden h-9 shrink-0 items-center rounded-full bg-gradient-to-r from-rose-500 to-violet-500 px-4 text-sm font-medium text-white shadow-sm transition hover:opacity-90 sm:inline-flex"
            >
                Message
            </button>
        </li>
    )
}

const Connections = () => {

    const dispatch = useDispatch()
    const connections = useSelector((store) => store.connection)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchConnections = useCallback(async () => {

        try {
            setError(null)

            const res = await axios.get(`${BASE_URL}/connection/connectionList`,
                { withCredentials: true }
            )

            dispatch(addConnection(res.data?.data ?? []))
        }

        catch (err) {
            // Surface the reason instead of rendering an indistinguishable blank.
            setError(err?.response?.data || err.message)
            dispatch(addConnection([]))
        }

        finally {
            setLoading(false)
        }

    }, [dispatch])

    useEffect(() => {
        const timer = window.setTimeout(fetchConnections, 0)
        return () => window.clearTimeout(timer)
    }, [fetchConnections])

    if (loading) {
        return (
            <div className="mx-auto mt-10 w-full max-w-2xl animate-pulse space-y-4 px-4">
                <div className="h-8 w-48 rounded-full bg-stone-200" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 rounded-3xl bg-stone-200" />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <Placeholder>
                <div>
                    <p className="text-sm font-medium text-rose-600">
                        Couldn&apos;t load your connections
                    </p>
                    <p className="mt-1 text-sm text-stone-500">{String(error)}</p>
                    <button
                        onClick={() => { setLoading(true); fetchConnections() }}
                        className="btn mt-4 h-9 rounded-full border-none bg-stone-900 px-4 text-sm font-medium text-white hover:bg-stone-800"
                    >
                        Try again
                    </button>
                </div>
            </Placeholder>
        )
    }

    if (!connections || connections.length === 0) {
        return (
            <Placeholder>
                <div>
                    <p className="text-sm font-medium text-stone-700">No connections yet</p>
                    <p className="mt-1 text-sm text-stone-500">
                        When someone accepts your request, they&apos;ll show up here.
                    </p>
                </div>
            </Placeholder>
        )
    }

    return (
        <div className="mx-auto mt-10 w-full max-w-2xl px-4 pb-16">

            <div className="flex items-baseline justify-between">
                <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
                    Connections
                </h1>
                <span className="rounded-full bg-gradient-to-r from-rose-500 to-violet-500 px-3 py-1 text-xs font-semibold tabular-nums text-white">
                    {connections.length}
                </span>
            </div>
            <p className="mt-1 text-sm text-stone-500">
                People who accepted your request — say hi!
            </p>

            <ul className="mt-6 space-y-4">
                {connections.map((user) => (
                    <ConnectionCard key={user._id} user={user} />
                ))}
            </ul>
        </div>
    )
}

export default Connections
