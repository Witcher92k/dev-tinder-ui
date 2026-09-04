import { useCallback, useEffect } from "react"
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import Feed from "./Feed";
import { BASE_URL } from '../utils/constants';

// Re-hydrates the store from the session cookie on mount. The feed API
// gets wired in here later.
function Body() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkUser = useCallback(async () => {


    try{

    const res = await axios.get(`${BASE_URL}/profile/view`,{
      withCredentials:true
    })

    dispatch(addUser(res.data));



  }

  catch{

    navigate('/login');

  }






  }, [dispatch, navigate])

  useEffect(()=>{
    const timer = window.setTimeout(checkUser, 0);
    return () => window.clearTimeout(timer);
  },[checkUser])


  return (
    <main className="relative mx-auto max-w-6xl overflow-hidden px-6 py-12 sm:overflow-visible">
      {/* ambient glow, same language as the login panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 size-[32rem] -translate-x-[70%] rounded-full bg-rose-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-64 size-[28rem] -translate-x-[15%] rounded-full bg-violet-500/10 blur-3xl"
      />

      <div className="relative text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-500">
          Discover
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-stone-900">
          Your feed
        </h1>
        <p className="mt-3 text-stone-500">
          Developers we think you should meet.
        </p>
      </div>

      <div className="relative">
        <Feed />
      </div>
    </main>
  )
}

export default Body
