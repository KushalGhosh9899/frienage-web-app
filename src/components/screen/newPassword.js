import React,{useState} from 'react';
import {useHistory,useParams} from 'react-router-dom';
import M from 'materialize-css';

const NewPassword  = () => {
    const History = useHistory();
    const [password,setPassword] = useState("");
    const{token} = useParams();
    const PostData = () =>{
        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
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
    return (
        <div>
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input
                type="password"
                placeholder="enter new password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="waves-effect waves-light btn"
                onClick={()=>PostData()}>Change Password</button>
            </div>
        </div>
    )
}

export default NewPassword ;