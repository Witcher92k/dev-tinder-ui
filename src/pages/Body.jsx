import { useEffect } from "react"
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";

// Re-hydrates the store from the session cookie on mount. The feed API
// gets wired in here later.
function Body() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkUser=async ()=>{


    try{

    const res = await axios.get('http://localhost:3000/profile/view',{
      withCredentials:true
    })

    dispatch(addUser(res.data));



  }

  catch(err){

    navigate('/login');

  }






  }

  useEffect(()=>{
    checkUser();
  },[])


  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-[-0.03em] text-stone-900">
        Your feed
      </h1>
      <p className="mt-3 text-stone-500">
        Developers we think you should meet.
      </p>

      <div className="mt-10 grid min-h-80 place-items-center rounded-2xl border border-dashed border-stone-300 bg-white/60">
        <p className="text-sm text-stone-400">Feed cards go here</p>
      </div>
    </main>
  )
}

export default Body
