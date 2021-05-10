import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import coverpic from '../../images/coverpic.jpg';
import { userContext } from '../../App';

const Profile = () => {
    const [commentBox, showCommentBox] = useState(false);
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(userContext);
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const [toggleTab, setToggleTab] = useState('1');
    const [viewImageModal, setViewImage] = useState(['']);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.mypost);
            })
        findFollowers();
        findFollowing();

    }, [])

    useEffect(() => {
        if (image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "instaclone");
            data.append("cloud_name", "socialbee");
            fetch("	https://api.cloudinary.com/v1_1/socialbee/image/upload", {
                method: "post",
                body: data
            }).then(res => res.json())
                .then(data => {
                    // localStorage.setItem("user", JSON.stringify({ ...state, pic: data.url }))
                    // dispatch({ type: "UPDATEPIC", payload: data.url })
                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            setUrl(data.url);
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result })
                            window.location.reload()
                        })
                })
                .catch(err => {
                    console.log(err);
                })

        }
    }, [image])
    const updatePhoto = (file) => {
        setImage(file)
    }
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

    const findFollowers = () => {
        fetch(`/findfollowers`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setFollowers(result.user);
            })
    }
    const findFollowing = () => {
        fetch(`/findfollowings`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setFollowing(result.user);
            })
    }

    return (
        <div className="profile">
            <div className="cover-pic">
                <img src={coverpic} className="cover-image" />
            </div>

            <div className="profile-top">
                <img className="profile-pic z-depth-5"
                    src={state ? state.pic : "loading.."}
                />
                {/* <div className="file-field input-field">
                            <div className="btn">
                                <span>Update Pic</span>
                                <input type="file" onChange={(e) => updatePhoto(e.target.files[0])}
                                />
                            </div>
                            <div className="file-path-wrapper" style={{ display: "hidden" }}>
                                <input className="file-path validate" type="text" />
                            </div>
                        </div> */}

                <div className="author-details">
                    <div className="author-personal-details">
                        <span className="author-name">
                            {state ? state.name : "loading"}
                        </span>
                        <span className="author-email">
                            {state ? state.email : "loading"}
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
                            <span>{state ? state.followers.length : "0"} </span>
                        </div>
                        <div>
                            <span className="profile-stats-span">Following</span>
                            <span>{state ? state.following.length : "0"}</span>
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
                            <h5 style={{ color: "#00C5FF" }}><center>You don't have any Followers.</center></h5>
                        </div>
                        :
                        followers.map(item => {
                            return (
                                <div className="people">
                                    <Link to={item._id == state._id ?"/profile":"/profile/" + item._id}>
                                        <img src={item.pic} />
                                    </Link>
                                    <div className="following-details">
                                        <Link to={item._id == state._id ?"/profile":"/profile/" + item._id}>
                                            <span className="following-name">
                                                {item.name}
                                            </span>
                                            <span className="following-email">
                                                {item.email}
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="btn-div">
                                        <Link to={item._id == state._id ?"/profile":"/profile/" + item._id}>
                                            <button className="btn-default dark">view profile</button>
                                        </Link>
                                    </div>
                                    <div className="btn-div">
                                        <button className="btn-default light">Message</button>
                                    </div>
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
                            <h5 style={{ color: "#00C5FF" }}><center>You Haven't followed anyone.</center></h5>
                        </div>
                        : following.map(item => {
                            return (
                                <div className="people">
                                    <Link to={item._id == state._id ?"/profile":"/profile/" + item._id}>
                                        <img src={item.pic} />
                                    </Link>
                                    <div className="following-details">
                                        <Link to={item._id == state._id ?"/profile":"/profile/" + item._id}>
                                            <span className="following-name">
                                                {item.name}
                                            </span>
                                            <span className="following-email">
                                                {item.email}
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="btn-div">
                                        <Link to={item._id == state._id ?"/profile":"/profile/" + item._id}>
                                            <button className="btn-default dark">view profile</button>
                                        </Link>
                                    </div>
                                    <div className="btn-div">
                                        <button className="btn-default light">Message</button>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
        </div>
    )
}

export default Profile;