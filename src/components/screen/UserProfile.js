import React, { useEffect, useState, useContext } from 'react';
import { userContext } from '../../App';
import { useParams, Link, useHistory } from 'react-router-dom';
import coverpic from '../../images/coverpic.jpg';

const Profile = () => {
    const [commentBox, showCommentBox] = useState(false);
    const [data, setData] = useState([]);
    const [toggleTab, setToggleTab] = useState('1');
    const [viewImageModal, setViewImage] = useState(['']);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const currentuser = JSON.parse(localStorage.getItem("user"));
    const history = useHistory();
    var conversation = null;

    const [userProfile, setProfile] = useState(null);
    const { state, dispatch } = useContext(userContext);
    const { userid } = useParams();
    const [showFollow, setshowFollow] = useState(state ? !state.following.includes(userid) : true);

    //For Dynamic Name Title
    document.title = userProfile ? userProfile.user.name + " | Friengage" : "Loading";


    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setProfile(result);
                setData(result.posts)
                // console.log(result)
            })

        findFollowers(userid);
        findFollowing(userid);
    }, [])
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setProfile(result);
                setData(result.posts)
                // console.log(result)
            })

        findFollowers(userid);
        findFollowing(userid);
        setshowFollow(
            state ? !state.following.includes(userid) : true
        )
    }, [userid])



    const likepost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })

        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            })
    }

    const unlikepost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })

        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData)
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text,
                postId
            })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    }
                    else {
                        return item
                    }
                })
                console.log(newData)
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }
    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        }).then(res => res.json())
            .then(result => {
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData);
                window.location.reload()
            })
    }

    const deleteComment = (commentid, comment, postby) => {
        fetch('/deletecomment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                commentid,
                comment,
                postby
            })
        }).then(res => res.json())
            .then(result => {
                console.log("Delete comment", result)
            })
    }

    const findFollowers = (user_id) => {
        fetch('/finduserfollowers', {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id
            })
        })
            .then(res => res.json())
            .then(result => {
                setFollowers(result.user);
                // console.log(result)
            })
    }
    const findFollowing = (user_id) => {
        fetch('/finduserfollowings', {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id
            })
        }).then(res => res.json())
            .then(result => {
                setFollowing(result.user);
                // console.log(result)
            })
    }

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
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data));
                setProfile((prevstate) => {
                    return {
                        ...prevstate,
                        user: {
                            ...prevstate.user,
                            followers: [...prevstate.user.followers, data._id]
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
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data));

                setProfile((prevstate) => {
                    const newFollower = prevstate.user.followers.filter(item => item != data._id)
                    return {
                        ...prevstate,
                        user: {
                            ...prevstate.user,
                            followers: newFollower
                        }
                    }
                })
                setshowFollow(true)
            })
    }

    const checkConversation = (findid) => {
        fetch(`/findconversation/${findid}/${currentuser._id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                // console.log(result.data[0]._id)
                if (result.data.length == 0) {
                    //add conversation then move to messages
                    newConversation(findid);
                }
                else if (result.data.length == 1) {
                    //move to messages
                    conversation = result.data[0]._id
                    // console.log(conversation)
                    history.push(`/messages?id=${conversation}`);
                }
            })
    }

    const newConversation = (findid) => {
        fetch(`/conversation`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                senderId: findid,
                receiverId: currentuser._id,
            })
        })
            .then(res => res.json())
            .then(result => {
                // console.log("from db", result)
                conversation = result.data._id;
                history.push(`/messages/${conversation}`);
            })
    }

    return (
        <>
            {
                userProfile ?
                    <div className="profile">
                        <div className="cover-pic">
                            <img src={coverpic} className="cover-image" />
                        </div>
                        {
                            showFollow ?
                                <a className="btn-default dark follow-btn z-depth-5"
                                    onClick={() => followUser()}
                                >Follow User</a>
                                :
                                <a className="btn-default light follow-btn z-depth-5"
                                    onClick={() => unfollowUser()}
                                >Unfollow User</a>

                        }
                        <div className="float-msg-btn">
                            <button
                                onClick={() => {
                                    checkConversation(userProfile.user._id)
                                }}
                                className="btn-default light">Message</button>
                        </div>

                        <div className="profile-top">
                            <img className="profile-pic z-depth-5"
                                src={userProfile ? userProfile.user.pic : "loading.."}
                            />

                            <div className="author-details">
                                <div className="author-personal-details">
                                    <span className="author-name">
                                        {userProfile.user.name}
                                    </span>
                                    <span className="author-email">
                                        {userProfile.user.email}
                                    </span>
                                </div>

                                <div className="profile-btn">

                                    <a class={toggleTab == '1' ? "waves-effect btn-flat profile-btn-active" : "waves-effect btn-flat"}
                                        onClick={() => {
                                            setToggleTab('1')
                                        }}
                                    >My Posts</a>
                                    <a class={toggleTab == '2' ? "waves-effect btn-flat profile-btn-active" : "waves-effect btn-flat"}
                                        onClick={() => {
                                            setToggleTab('2')
                                        }}
                                    >Photos</a>
                                    <a class={toggleTab == '3' ? "waves-effect btn-flat profile-btn-active" : "waves-effect btn-flat"}
                                        onClick={() => {
                                            setToggleTab('3')
                                        }}
                                    >Followers</a>
                                    <a class={toggleTab == '4' ? "waves-effect btn-flat profile-btn-active" : "waves-effect btn-flat"}
                                        onClick={() => {
                                            setToggleTab('4')
                                        }}
                                    >Following</a>
                                    <a class={toggleTab == '5' ? "waves-effect btn-flat profile-btn-active" : "waves-effect btn-flat"}
                                        onClick={() => {
                                            setToggleTab('5')
                                        }}
                                    >Settings</a>

                                </div>

                                <div className="profile-stats">
                                    <div>
                                        <span className="profile-stats-span">Posts</span>
                                        <span>{data.length}</span>
                                    </div>
                                    <div>
                                        <span className="profile-stats-span">Followers</span>
                                        <span>{userProfile.user.followers.length} </span>
                                    </div>
                                    <div>
                                        <span className="profile-stats-span">Following</span>
                                        <span>{userProfile.user.following.length}</span>
                                    </div>

                                </div>
                            </div>

                            <div className="about-me">
                                <h2>About Me!</h2>
                                <span>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                when an unknown printer took a galley of type and scrambled it to make a type specimen book.</span>
                            </div>
                        </div>
                        {/* My Posts */}
                        <div className={toggleTab == 1 ? "toogle-tab-show" : "toogle-tab-hide"}>
                            {
                                data.map(item => {
                                    return (
                                        <div className="card home-card z-depth-5">
                                            <div className="post-top">
                                                <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"} >
                                                    <img className="author-pic"
                                                        src={item ? item.postedBy.pic : "loading.."}
                                                    />
                                                </Link>
                                                <div className="post-details">
                                                    <h5 className="author">
                                                        <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"} >
                                                            {item.postedBy.name}</Link>
                                                    </h5>
                                                    <span className="post-time">
                                                        <i className="material-icons time-icon">access_time</i>
                                                        <h5 className="postedtime">Posted at 11:30 AM</h5>
                                                    </span>
                                                </div>
                                                {item.postedBy._id == state._id
                                                    ? <i className="material-icons delete-post"
                                                        onClick={() => { deletePost(item._id) }}
                                                    >delete_forever</i>
                                                    :
                                                    <i className="material-icons"></i>
                                                }

                                            </div>

                                            <div className="post-content">
                                                <h2>{item.title}</h2>
                                                <p>{item.body}</p>
                                            </div>

                                            <div title="Click to view Full Image">
                                                <img src={item.photo} onClick={() => {
                                                    setViewImage(item.photo)
                                                }} data-target="viewImage" className="card-image modal-trigger" />
                                            </div>
                                            <div className="card-content">
                                                <div className="card-icons">
                                                    {item.likes.includes(state._id)
                                                        ?
                                                        <>
                                                            <i className="material-icons like-icon">favorite</i>
                                                            <span>{item.likes.length} likes</span>
                                                        </>
                                                        :
                                                        <>
                                                            <i className="material-icons">favorite_border</i>
                                                            <span>{item.likes.length} Likes</span>
                                                        </>
                                                    }
                                                    <i className="material-icons">chat_bubble_outline</i>
                                                    <span>{item.comments.length} comment</span>
                                                </div>
                                                <div className="divider card-icons-divider" ></div>

                                                <div className="card-icons-btn">

                                                    {
                                                        item.likes.includes(state._id)
                                                            ?
                                                            <><a class="waves-effect btn-flat" onClick={() => { unlikepost(item._id) }}>
                                                                <i class="material-icons">thumb_down</i>
                                                        Unlike
                                                    </a>
                                                            </>
                                                            :
                                                            <><a class="waves-effect btn-flat" onClick={() => { likepost(item._id) }}>
                                                                <i class="material-icons">thumb_up</i>
                                                    Like
                                                    </a>
                                                            </>
                                                    }
                                                    <a class="waves-effect btn-flat" style={{ marginLeft: "3rem" }} onClick={() => {
                                                        commentBox ?
                                                            showCommentBox(false)
                                                            :
                                                            showCommentBox(true)
                                                    }} >
                                                        <i className="material-icons">textsms</i>
                                        Comment
                                        </a>
                                                </div>

                                                <div class={commentBox ? "show-comment-box" : "hide-comment-box"}>
                                                    <form onSubmit={(e) => {
                                                        e.preventDefault()
                                                        makeComment(e.target[1].value, item._id)
                                                        e.target[0].value = ""
                                                        e.target[1].value = ""
                                                    }} style={{ marginBottom: "1rem" }}
                                                    >
                                                        <div class="input-field col s6 comment-fields">
                                                            <button class="waves-effect btn-flat right" type="submit">
                                                                <i class="material-icons comment-send">send</i>
                                                            </button>
                                                            <input className="comment-input"
                                                                type="text"
                                                                placeholder="Add Comment" />
                                                        </div>
                                                        <span>All comments <i class="material-icons drop-arrow-comment">arrow_drop_down</i></span>
                                                    </form>
                                                    {

                                                        item.comments.map(record => {
                                                            // console.log(record)
                                                            return (
                                                                <div className="row">
                                                                    <div className="comment-author">
                                                                        <img className="author-pic"
                                                                            src={record.postedBy.pic} />
                                                                    </div>
                                                                    <div className="comment-txt">
                                                                        {/* {record._id} */}
                                                                        <span className="comment-posted">{record.postedBy.name}</span>
                                                                        <span className="comment">{record.text}</span>
                                                                    </div>
                                                                    <button className="waves-effect btn-flat right delete-comment"
                                                                        onClick={() => {
                                                                            deleteComment(record._id, record.text, record.postedBy.name)
                                                                        }}>Delete Comment</button>
                                                                </div>

                                                            )
                                                        })
                                                    }
                                                </div>


                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        {/* Photos Gallery */}
                        <div className={toggleTab == 2 ? "gallery toogle-tab-show" : "gallery toogle-tab-hide"}>
                            {
                                data.map(item => {
                                    return (
                                        <img key={item._id} className="item z-depth-2" src={item.photo} alt={item.title} />
                                    )
                                })
                            }
                        </div>

                        {/* Followers */}
                        <div className={toggleTab == 3 ? "people-list toogle-tab-show" : "toogle-tab-hide"}>
                            {
                                followers == 0 ?
                                    <div>
                                        <h5 style={{ color: "#00C5FF" }}><center>User don't have any Followers.</center></h5>
                                    </div>
                                    :
                                    followers.map(item => {
                                        return (
                                            <div className="people">
                                                <Link to={item._id == state._id ? "/profile" : "/profile/" + item._id}>
                                                    <img src={item.pic} />
                                                </Link>
                                                <div className="following-details">
                                                    <Link to={item._id == state._id ? "/profile" : "/profile/" + item._id}>
                                                        <span className="following-name">
                                                            {item.name}
                                                        </span>
                                                        <span className="following-email">
                                                            {item.email}
                                                        </span>
                                                    </Link>
                                                </div>
                                                <div className="btn-div">
                                                    <Link to={item._id == state._id ? "/profile" : "/profile/" + item._id}>
                                                        <button className="btn-default dark">view profile</button>
                                                    </Link>
                                                </div>
                                                {
                                                    item._id !== state._id ?
                                                        <div className="btn-div">
                                                            <button
                                                                onClick={() => {
                                                                    checkConversation(item._id)
                                                                }}
                                                                className="btn-default light">Message</button>
                                                        </div> :
                                                        ""

                                                }

                                            </div>
                                        )
                                    })
                            }

                        </div>

                        {/* Following */}
                        <div className={toggleTab == 4 ? "people-list toogle-tab-show" : "toogle-tab-hide"}>
                            {
                                following == 0 ?
                                    <div>
                                        <h5 style={{ color: "#00C5FF" }}><center>User Haven't followed anyone.</center></h5>
                                    </div>
                                    : following.map(item => {
                                        return (
                                            <div className="people">
                                                <Link to={item._id == state._id ? "/profile" : "/profile/" + item._id}>
                                                    <img src={item.pic} />
                                                </Link>
                                                <div className="following-details">
                                                    <Link to={item._id == state._id ? "/profile" : "/profile/" + item._id}>
                                                        <span className="following-name">
                                                            {item.name}
                                                        </span>
                                                        <span className="following-email">
                                                            {item.email}
                                                        </span>
                                                    </Link>
                                                </div>
                                                <div className="btn-div">
                                                    <Link to={item._id == state._id ? "/profile" : "/profile/" + item._id}>
                                                        <button className="btn-default dark">view profile</button>
                                                    </Link>
                                                </div>
                                                {
                                                    item._id !== state._id ?
                                                        <div className="btn-div">
                                                            <button
                                                                onClick={() => {
                                                                    checkConversation(item._id)
                                                                }}
                                                                className="btn-default light">Message</button>
                                                        </div> :
                                                        ""

                                                }
                                            </div>
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