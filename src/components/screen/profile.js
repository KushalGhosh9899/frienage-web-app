import React, { useEffect, useState, useContext } from 'react';
import { userContext } from '../../App';

const Profile = () => {
    const [mypics, setMypics] = useState([]);
    const { state, dispatch } = useContext(userContext);
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setMypics(result.mypost);
            })
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
                        method:"put",
                        headers: {
                            "Content-Type":"application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body:JSON.stringify({
                            pic:data.url
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

    return (
        <div style={{ maxWidth: "70%", margin: "0px auto" }}>
            <div className="profile-top">
                <div>
                    <img style={{ width: "300px", height: "300px", borderRadius: "150px" }}
                        src={state ? state.pic : "loading.."}
                    />
                    <div className="file-field input-field">
                        <div className="btn">
                            <span>Update Pic</span>
                            <input type="file" onChange={(e) => updatePhoto(e.target.files[0])}
                            />
                        </div>
                        <div className="file-path-wrapper" style={{display:"hidden"}}>
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>

                </div>

                <div className="profile-contents">
                    <h4>
                        {state ? state.name : "loading"}
                    </h4>
                    <div className="profile-stats">
                        <h6>{mypics.length} posts</h6>
                        <h6>{state ? state.followers.length : "0"} followers</h6>
                        <h6>{state ? state.following.length : "0"} following</h6>
                    </div>
                </div>
            </div>

            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }

            </div>
        </div>
    )
}

export default Profile;