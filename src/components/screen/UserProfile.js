import React, { useEffect, useState, useContext } from 'react';
import { userContext } from '../../App'
import { useParams } from 'react-router-dom'

const Profile = () => {
    const [userPofile, setProfile] = useState(null);
    const { state, dispatch } = useContext(userContext);
    const { userid } = useParams();    
    const [showFollow,setshowFollow] = useState(state?!state.following.includes(userid):true);
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setProfile(result);
            })
    }, [])

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {                
                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data));
                setProfile((prevstate)=>{
                    return {
                        ...prevstate,
                            user:{
                                ...prevstate.user,
                                followers:[...prevstate.user.followers,data._id]
                            }
                    }
                })
                setshowFollow(false)
            })
    }
    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {                
                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data));
                
                setProfile((prevstate)=>{
                    const newFollower = prevstate.user.followers.filter(item=>item != data._id)
                    return {
                        ...prevstate,
                            user:{
                                ...prevstate.user,
                                followers:newFollower
                            }
                    }
                })
                setshowFollow(true)
            })
        }

    return (
        <>
            {userPofile ?
                <div style={{ maxWidth: "70%", margin: "0px auto" }}>
                    <div className="profile-top">
                        <div>
                            <img style={{ width: "300px", height: "300px", borderRadius: "150px" }}
                                src={state?state.pic:"loading.."}
                            />
                        </div>
                        <div className="profile-contents">
                            <h4>
                                {userPofile.user.name}
                            </h4>
                            <h4>
                                {userPofile.user.email}
                            </h4>
                            <div className="profile-stats">
                                <h6>{userPofile.posts.length} posts</h6>
                                <h6>{userPofile.user.followers.length} followers</h6>
                                <h6>{userPofile.user.following.length} following</h6>
                            </div>
                            {
                                showFollow?
                                <a className="waves-effect waves-light btn"
                                onClick={() => followUser()}
                            >Follow</a>
                            :
                            <a className="waves-effect waves-light btn"
                                onClick={() => unfollowUser()}
                            >Unfollow</a>
                            }
                            
                            
                        </div>
                    </div>

                    <div className="gallery">
                        {
                            userPofile.posts.map(item => {
                                return (
                                    <img key={item._id} className="item" src={item.photo} alt={item.title} />
                                )
                            })
                        }

                    </div>
                </div>

                :
                <h2>loading..</h2>}
        </>
    )
}

export default Profile;