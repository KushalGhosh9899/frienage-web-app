import React, { useState, useEffect, useContext } from 'react';
import { userContext } from '../../App';
import {Link} from 'react-router-dom';

const Home = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(userContext);
    useEffect(() => {
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.posts);
            })
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
        .then(res=>res.json())
        .then(result=>{
            const newData = data.map(item => {
                if (item._id == result._id) {
                    return result
                }
                else {
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }
    const deletePost=(postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData);
        })
    }

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card">
                            {/* <img style={{width:"50px",height:"50px",borderRadius:"25px"}} 
                            src={item?item.postedBy.pic:"loading.."}
                            /> */}
                            <h5><Link to={item.postedBy._id !==state._id?"/profile/"+item.postedBy._id:"/profile"} >{item.postedBy.name}</Link> 
                            {item.postedBy._id == state._id
                            &&<i className="material-icons" style={{float:"right"}}
                            onClick={()=>{deletePost(item._id)}}
                            >delete_forever</i>
                            }</h5>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                {item.likes.includes(state._id)
                                    ?
                                    <i className="material-icons"
                                        onClick={() => { unlikepost(item._id) }}>thumb_down</i>
                                    :
                                    <i className="material-icons"
                                        onClick={() => { likepost(item._id) }}
                                    >thumb_up</i>
                                }
                                <h6>{item.likes.length} Likes</h6>
                                <h5>{item.title}</h5>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return (
                                            <h6><span><b>{record.postedBy.name}</b></span> {record.text}</h6>
                                        )
                                    })
                                }

                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Add Comment"
                                    />
                                </form>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default Home;