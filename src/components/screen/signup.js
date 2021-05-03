import React,{useEffect, useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';

const Signup = () => {
    const History = useHistory();
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState(undefined);
    useEffect(()=>{
        if(url){
            uploadFields();
        }
    },[url])

    const uploadPic = () => {
        const data = new FormData();
        data.append("file", image);
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
    const uploadFields = () =>{
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html: "Invalid Email",classes:"#e53935 red darken-1"});
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes:"#e53935 red darken-1"});
            }
            else{
                M.toast({html: data.message,classes:"#00c853 green accent-4"}) ;
                History.push('/login');
            }
        })
    }
    const PostData = () =>{
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
        
    }

    return (
        <div>
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input
                type="text"
                placeholder="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
                <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                 <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Pic</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="waves-effect waves-light btn"
                onClick={()=>PostData()}
                >Signup</button>
                <h6>Already have an account? <Link className="link" to='/login'>Login</Link></h6>
            </div>
        </div>
    )
}

export default Signup;