import React,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';

const Reset = () => {
    const History = useHistory();
    const [email,setEmail] = useState("");
    const PostData = () =>{
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html: "Invalid Email",classes:"#e53935 red darken-1"});
            return
        }
        fetch('/reset-password',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
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
                type="email"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <button className="waves-effect waves-light btn"
                onClick={()=>PostData()}>Reset Password</button>
            </div>
        </div>
    )
}

export default Reset;