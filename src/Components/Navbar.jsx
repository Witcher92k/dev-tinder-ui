import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { removeUser } from '../utils/userSlice'
import { BASE_URL } from '../utils/constants';

function Navbar() {

    const user = useSelector(store=>store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        await axios.post(
          `${BASE_URL}/logout`,
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.error(err?.response?.data || err.message);
      } finally {
        // Clear locally either way - a failed call shouldn't strand the user
        // in a logged-in shell.
        dispatch(removeUser());
        navigate('/login');
      }
    }

  return (


    <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-stone-900"
        >
          devTinder
        </Link>


        {user && (
          <div className="flex items-center gap-6">
            {[
              { to: '/', label: 'Home' },
              { to: '/requests', label: 'Requests' },
              { to: '/connections', label: 'Connections' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative py-1 text-sm font-medium transition ${
                    isActive
                      ? 'text-stone-900 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-rose-500 after:to-violet-500'
                      : 'text-stone-600 hover:text-stone-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="flex cursor-pointer items-center gap-3"
            >
              <span className="hidden text-sm font-medium text-stone-700 sm:inline">
                {user.firstName}
              </span>

              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={`${user.firstName}'s profile`}
                  className="size-9 rounded-full object-cover ring-1 ring-stone-200"
                />
              ) : (
                <span className="grid size-9 place-items-center rounded-full bg-stone-900 text-sm font-medium text-white">
                  {user.firstName?.[0]?.toUpperCase()}
                </span>
              )}
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu z-50 mt-3 w-44 rounded-xl border border-stone-200 bg-white p-2 text-stone-700 shadow-lg"
            >
              <li>
                <button onClick={handleLogout}>Log out</button>
              </li>
            </ul>
          </div>
          </div>
        )}


      </nav>
    </header>
  )
}

export default Navbar
