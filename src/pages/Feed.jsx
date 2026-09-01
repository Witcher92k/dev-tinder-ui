import React, { useEffect } from 'react'
import { UserCard } from './UserCard'

const Feed = () => {


    const getUserList = async () => {

        try {


            const data = await axios.get('connection/request/feed',
                { withCredentials: true }
            )

            setUserList(data);


        }


        catch (err) {

            setUserList([]);




        }




    }





    const [userList, setUserList] = useState([]);
    useEffect(() => {
        getUserList();
    }, [])



    return (
       {

        userList.map(item=>)

       }
    )
}

export default Feed