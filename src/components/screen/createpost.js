import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {
    const History = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [url, setUrl] = useState("");
    const createPostModal = useRef(null)

    useEffect(() => {
        M.Modal.init(createPostModal.current)
    })

    useEffect(() => {
        if (url) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#e53935 red darken-1" });
                    }
                    else {
                        M.toast({ html: "Created Post Successfully", classes: "#00c853 green accent-4" });
                        window.location.reload();
                    }
                })
        }
    }, [url]);

    const postDetails = (fileImage) => {
        const data = new FormData();
        data.append("file", fileImage);
        data.append("upload_preset", "instaclone");
        data.append("cloud_name", "socialbee");

        fetch("	https://api.cloudinary.com/v1_1/socialbee/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json())
            .then(data => {
                setUrl(data.url);
            })
            .catch(err => {
                console.log(err);
            })

    }
    return (
        <div>
            <div className="card auth-card z-depth-3 modal-trigger" data-target="createPostModal">
                <h2>Create New Post</h2>
                <div>
                    {/* For Post Input Field(Demo) */}
                    <div class="input-field col s6 text-fields">
                        <i class="material-icons prefix">mode_edit</i>
                        <input className="text-input" type="text" placeholder="Type what's on your mind" />
                    </div>

                    <button className="btn-default waves-effect waves-light dark">Post</button>

                </div>
            </div>

            {/* <!-- Create Post Modal Structure --> */}
            <div id="createPostModal" className="modal" ref={createPostModal}>
                <div className="modal-content create-post-modal">
                    <form onSubmit={
                        (e) => {
                            e.preventDefault()
                            const title = document.getElementById('get-title').value;
                            const body = document.getElementById('get-body').value;
                            const file = document.getElementById('get-file').files[0];
                            setTitle(title);
                            setBody(body);
                            postDetails(file);
                        }
                    }>
                        <h2>Create Post</h2>
                        {/* For Post title Input Field */}
                        <div class="input-field col s6 text-fields">
                            <i class="material-icons prefix">create</i>
                            <input className="text-input" id='get-title' type="text" placeholder="Enter Title"
                            />
                        </div>

                        {/* For Post body Input Field */}
                        <div class="input-field col s6 text-fields">
                            <i class="material-icons prefix">view_headline</i>
                            <input className="text-input" type="text" id='get-body' placeholder="Description of the Post" />
                        </div>

                        <div className="file-field input-field btn-field">
                            <div className="btn-default waves-effect waves-light light">
                                <span>Select Photo</span>
                                <input type="file" id="get-file"
                                />
                            </div>

                            <div class="file-path-wrapper">
                                <input class="file-path validate" type="hidden" />
                            </div>
                        </div>

                        <button className="btn-long waves-effect waves-light dark" type="submit">Upload Post
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;