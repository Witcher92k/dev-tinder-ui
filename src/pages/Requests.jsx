import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addSingleConnection } from '../utils/connectionSlice'
import { BASE_URL } from '../utils/constants';

const API_BASE = BASE_URL
const RECEIVED_ENDPOINTS = [
    `${API_BASE}/connection/request/received`,
    `${API_BASE}/user/requests/received`,
]

const REVIEW_ENDPOINTS = [
    (status, requestId) => `${API_BASE}/connection/request/review/${status}/${requestId}`,
    (status, requestId) => `${API_BASE}/request/review/${status}/${requestId}`,
]

const Placeholder = ({ children }) => (
    <div className="mx-auto mt-10 grid min-h-80 w-full max-w-3xl place-items-center rounded-2xl border border-dashed border-stone-300 bg-white/70 px-6 text-center shadow-sm">
        {children}
    </div>
)

const getRequestUser = (request) => (
    request?.fromUserId ||
    request?.fromUser ||
    request?.sender ||
    request?.user ||
    request
)

const getRequestId = (request) => request?._id || request?.requestId || request?.id

const getErrorMessage = (err) => {
    const data = err?.response?.data

    if (typeof data === 'string') return data
    if (data?.message) return data.message
    if (data?.error) return data.error

    return err?.message || 'Something went wrong'
}

const getRequestsFromResponse = (payload) => {
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload?.data)) return payload.data
    if (Array.isArray(payload?.requests)) return payload.requests
    if (Array.isArray(payload?.receivedRequests)) return payload.receivedRequests

    return []
}

const requestWithFallback = async (endpoints, buildRequest) => {
    let lastError

    for (const endpoint of endpoints) {
        try {
            return await buildRequest(endpoint)
        } catch (err) {
            lastError = err

            if (![404, 405].includes(err?.response?.status)) {
                throw err
            }
        }
    }

    throw lastError
}

const formatRequestDate = (value) => {
    if (!value) return null

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
    }).format(date)
}

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
            {initials || '?'}
        </div>
    )
}

const RequestCard = ({ request, busy, onReview }) => {
    const user = getRequestUser(request)
    const requestId = getRequestId(request)
    const { firstName, lastName, age, gender, about, skills = [] } = user || {}
    const requestedOn = formatRequestDate(request?.createdAt || request?.updatedAt)
    const name = [firstName, lastName].filter(Boolean).join(' ') || 'Developer'

    return (
        <li className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-900/5 sm:p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar firstName={firstName} lastName={lastName} photoUrl={user?.photoUrl} />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h2 className="min-w-0 truncate text-lg font-semibold tracking-tight text-stone-900">
                            {name}
                        </h2>
                        {(age != null || gender || requestedOn) && (
                            <span className="text-sm text-stone-500">
                                {age != null && age}
                                {age != null && gender ? ' · ' : ''}
                                {gender}
                                {(age != null || gender) && requestedOn ? ' · ' : ''}
                                {requestedOn && `Requested ${requestedOn}`}
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

                <div className="grid grid-cols-2 gap-2 sm:w-44 sm:grid-cols-1">
                    <button
                        type="button"
                        disabled={busy || !requestId}
                        onClick={() => onReview(requestId, 'accepted')}
                        className="btn h-10 rounded-full border-none bg-gradient-to-r from-rose-500 to-violet-500 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50"
                    >
                        {busy ? 'Saving...' : 'Accept'}
                    </button>
                    <button
                        type="button"
                        disabled={busy || !requestId}
                        onClick={() => onReview(requestId, 'rejected')}
                        className="btn h-10 rounded-full border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 shadow-sm hover:border-stone-300 hover:bg-stone-50 disabled:opacity-50"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </li>
    )
}

const Requests = () => {
    const dispatch = useDispatch()
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [busyId, setBusyId] = useState(null)

    const count = useMemo(() => requests.length, [requests])

    const fetchRequests = async () => {
        setLoading(true)

        try {
            setError(null)

            const res = await requestWithFallback(RECEIVED_ENDPOINTS, (endpoint) => (
                axios.get(endpoint, { withCredentials: true })
            ))

            setRequests(getRequestsFromResponse(res.data))
        } catch (err) {
            setError(getErrorMessage(err))
            setRequests([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = window.setTimeout(fetchRequests, 0)
        return () => window.clearTimeout(timer)
    }, [])

    const handleReview = async (requestId, status) => {
        const request = requests.find((item) => getRequestId(item) === requestId)
        const previousRequests = requests

        try {
            setBusyId(requestId)
            setError(null)
            setRequests((current) => current.filter((item) => getRequestId(item) !== requestId))

            await requestWithFallback(
                REVIEW_ENDPOINTS.map((endpoint) => endpoint(status, requestId)),
                (endpoint) => axios.post(endpoint, {}, { withCredentials: true })
            )

            if (status === 'accepted') {
                dispatch(addSingleConnection(getRequestUser(request)))
            }
        } catch (err) {
            setRequests(previousRequests)
            setError(getErrorMessage(err))
        } finally {
            setBusyId(null)
        }
    }

    if (loading) {
        return (
            <div className="mx-auto mt-10 w-full max-w-3xl animate-pulse space-y-4 px-4">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-44 rounded-full bg-stone-200" />
                    <div className="h-7 w-12 rounded-full bg-stone-200" />
                </div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-36 rounded-3xl bg-stone-200" />
                ))}
            </div>
        )
    }

    if (!requests || requests.length === 0) {
        return (
            <Placeholder>
                <div>
                    {error ? (
                        <>
                            <p className="text-sm font-medium text-rose-600">
                                Couldn&apos;t load requests
                            </p>
                            <p className="mt-1 text-sm text-stone-500">{error}</p>
                            <button
                                type="button"
                                onClick={fetchRequests}
                                className="btn mt-4 h-9 rounded-full border-none bg-stone-900 px-4 text-sm font-medium text-white hover:bg-stone-800"
                            >
                                Try again
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-sm font-medium text-stone-700">No pending requests</p>
                            <p className="mt-1 text-sm text-stone-500">
                                New people who want to connect with you will appear here.
                            </p>
                        </>
                    )}
                </div>
            </Placeholder>
        )
    }

    return (
        <div className="mx-auto mt-10 w-full max-w-3xl px-4 pb-16">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
                        Requests
                    </h1>
                    <p className="mt-1 text-sm text-stone-500">
                        Review people waiting to connect with you.
                    </p>
                </div>
                <span className="rounded-full bg-gradient-to-r from-rose-500 to-violet-500 px-3 py-1 text-xs font-semibold tabular-nums text-white">
                    {count}
                </span>
            </div>

            {error && (
                <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={fetchRequests}
                        className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
                    >
                        Retry
                    </button>
                </div>
            )}

            <ul className="mt-6 space-y-4">
                {requests.map((request, index) => {
                    const requestId = getRequestId(request)
                    return (
                        <RequestCard
                            key={requestId ?? index}
                            request={request}
                            busy={busyId === requestId}
                            onReview={handleReview}
                        />
                    )
                })}
            </ul>
        </div>
    )
}

export default Requests
