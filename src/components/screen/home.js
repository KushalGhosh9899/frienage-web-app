import React, { useState, useEffect, useContext, useRef } from 'react';
import { userContext } from '../../App';
import { Link } from 'react-router-dom';
import M from 'materialize-css';
import CreatePost from './createpost';
import Conversation from '../screen/conversations/conversation';

const Home = () => {
    const [commentBox, showCommentBox] = useState(false);
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(userContext);
    const [viewImageModal, setViewImage] = useState(['']);
    const viewImage = useRef(null);

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const [conversations, setConversations] = useState([]);
    const userid = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        M.Modal.init(viewImage.current);
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result.posts)
                setData(result.posts);
            })
        findFollowers();
        findFollowing();
        getdata();
    }, [])

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
    const getdata = async () => {
        await fetch(`/conversation/${userid._id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json",
            }
        }).then(res => res.json())
            .then(result => {
                setConversations(result.data);
            })
    }


    return (
        <div className="home">
            {/* Your Following and Conversations*/}
            <div className="sides">
                {/* Followings */}
                <div className="z-depth-1">
                    <div className="info">
                        <h2>Followings</h2>
                        <span>
                            {state ? state.following.length : "0"}
                        </span>
                    </div>
                    {
                        following == 0 ?
                            <div>
                                <h5 style={{ color: "#00C5FF" }}><center>You Haven't followed anyone.</center></h5>
                            </div>
                            : following.map(item => {
                                return (
                                    <div className="people" onClick={() => window.location.href = `/profile/${item._id}`}>
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
                                    </div>
                                )
                            })
                    }

                </div>

                {/* All Conversations */}
                <div className="z-depth-1 conversations-home">
                    <h2>All Conversations</h2>
                    {
                        conversations.map((item) => (
                            <div onClick={() => window.location.href = '/messages'}>
                                <Conversation conversation={item} currentUser={userid._id} />
                            </div>
                        ))
                    }

                </div>
            </div>

            <div className="center-side">
                <CreatePost />
                {
                    data.map(item => {
                        return (
                            <div className="card home-card z-depth-1">
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
                {/* <!-- Modal Structure --> */}
                <div id="viewImage" className="modal image-modal" ref={viewImage} style={{ color: "black" }}>
                    <div className="modal-content">
                        <img className="image-block" src={viewImageModal} />
                    </div>

                    <div className="modal-footer">
                        <button className="modal-close waves-effect waves-green btn-flat">Close Image</button>
                    </div>
                </div>
            </div>

            {/* Your Followers */}
            <div className="sides">
                <div className="z-depth-1">
                    <div className="info">
                        <h2>Your Followers</h2>
                        <span>
                            {state ? state.followers.length : "0"}
                        </span>
                    </div>
                    {
                        followers == 0 ?
                            <div>
                                <h5 style={{ color: "#00C5FF" }}><center>You don't have any Followers.</center></h5>
                            </div>
                            :
                            followers.map(item => {
                                return (
                                    <div className="people" onClick={() => window.location.href = `/profile/${item._id}`}>
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
                                    </div>
                                )
                            })
                    }
                </div>

            </div>

        </div>
    )
}

export default Home;