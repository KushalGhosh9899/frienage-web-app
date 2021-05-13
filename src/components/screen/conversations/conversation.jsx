import './conversation.css';
import { useEffect, useState } from 'react';

const Conversation = ({ conversation, currentUser }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser);

        fetch(`/user/${friendId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            }
        }).then(res => res.json())
            .then(result => {
                setUser(result.user);
                // console.log(result.user)
            })
    }, [currentUser, conversation])

    return (

        <div>
            {
                user ?
                    <div className="list-profile">

                        <img src={user.pic} />
                        <div>
                            <span>{user.name}</span>
                            <span className="email">{user.email}</span>
                        </div>
                    </div>
                    :
                    "...loading"
            }

        </div>
    )
}

export default Conversation