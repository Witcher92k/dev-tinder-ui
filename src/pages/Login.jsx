import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { addUser } from '../utils/userSlice'

// No state here on purpose - inputs are uncontrolled and carry `name`
// attributes so they can be read off the form, or swapped to controlled
// inputs later without touching the markup.



function Login() {

  const [emailId,setEmaild] = useState('');
  const [password,setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginUp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:3000/login',
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate('/');
    } catch (err) {
      console.error(err?.response?.data || err.message);
    }
  }


  return (
    <div className="grid min-h-[calc(100svh-4rem)] bg-stone-50 lg:grid-cols-2">
      {/* ---- editorial panel (desktop only) ---- */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-stone-900 p-14 text-stone-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-rose-500/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 size-[26rem] rounded-full bg-violet-500/20 blur-3xl"
        />

        <span className="relative text-lg font-semibold tracking-tight">
          devTinder
        </span>

        <div className="relative max-w-md">
          <h2 className="text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-white">
            Designed to be deleted.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone-400">
            Real profiles, thoughtful matches, and conversations worth having.
          </p>
        </div>

        <p className="relative text-sm text-stone-500">
          &copy; {new Date().getFullYear()} devTinder
        </p>
      </aside>

      {/* ---- form ---- */}
      <main className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <span className="mb-10 block text-lg font-semibold tracking-tight text-stone-900 lg:hidden">
            devTinder
          </span>

          <h1 className="text-4xl font-semibold tracking-[-0.03em] text-stone-900">
            Welcome back
          </h1>
          <p className="mt-3 text-stone-500">
            Sign in to pick up where you left off.
          </p>

          <form className="mt-10 space-y-5">
            <div>
              <label
                htmlFor="emailId"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Email
              </label>
              <input
                value={emailId}
                onChange={(e)=>setEmaild(e.target.value)}
                id="emailId"
                name="emailId"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="input h-12 w-full rounded-xl border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-stone-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-stone-500 underline-offset-4 hover:text-stone-900 hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <input
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="input h-12 w-full rounded-xl border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none"
              />
            </div>

            <button onClick={loginUp}
              type="submit"
              className="btn h-12 w-full rounded-full border-none bg-stone-900 text-base font-medium text-white shadow-sm hover:bg-stone-800"
            >
              Sign in
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-500">
            New here?{' '}
            <Link
              to="/signup"
              className="font-medium text-stone-900 underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Login
