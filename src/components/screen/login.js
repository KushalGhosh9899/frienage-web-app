import React,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {userContext} from '../../App';
import M from 'materialize-css';

const Login = () => {
    const {state, dispatch} = useContext(userContext);
    const History = useHistory();
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const PostData = () =>{
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html: "Invalid Email",classes:"#e53935 red darken-1"});
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes:"#e53935 red darken-1"});
            }
            else{
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("user",JSON.stringify(data.user));
                dispatch({type:"USER",payload:data.user})
                M.toast({html: "Successfully Signed In",classes:"#00c853 green accent-4"}) ;
                History.push('/');
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
                <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="waves-effect waves-light btn"
                onClick={()=>PostData()}>Login</button>
                <h6>Already have an account? <Link className="link" to='/Signup'>Signup</Link></h6>
                <h6>Forgot Password?<Link className="link" to='/reset-password'>Reset</Link></h6>
            </div>
        </div>
    )
}

export default Login;