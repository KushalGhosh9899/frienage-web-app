import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { userContext } from '../../App';
import M from 'materialize-css';
import loginImage from '../../images/loginscreen.svg'

document.title = "Login | Friengage";

const Login = () => {
    const { state, dispatch } = useContext(userContext);
    const History = useHistory();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const PostData = () => {
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            M.toast({ html: "Invalid Email", classes: "#e53935 red darken-1" });
            return
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#e53935 red darken-1" });
                }
                else {
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: "Successfully Signed In", classes: "#00c853 green accent-4" });
                    History.push('/');
                }
            })
    }
    return (
        <div>
            <div className="login-container">
                <div className="svg-graphics">
                    <img src={loginImage} alt="login-svg" className="login-svg responsive-img" />
                </div>
                <div className="login-card">
                    <div>
                        <h2 className="top-heading">Sign In</h2>
                        {/* For Email Input Field */}
                        <div class="input-field col s6 text-fields">
                            <i class="material-icons prefix">account_circle</i>
                            <input className="text-input" type="email" placeholder="Enter your Username" value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        {/* For Password Input Field */}
                        <div class="input-field col s6 text-fields">
                            <i class="material-icons prefix">security</i>
                            <input className="text-input" type="password" placeholder="Enter your Password" value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="group-txt">
                            <p style={{width:"50%"}}>
                                <label className="txt-lower">
                                    <input type="checkbox" checked="checked" />
                                    <span style={{fontSize:"0.85rem"}}>Remember Me</span>
                                </label>
                            </p>

                            <h6 style={{width:"50%",textAlign:"end",margin:"auto 0"}} className="txt-lower"><Link className="link" to='/reset-password'>Forgot Password?</Link></h6>
                        </div>
                        <button className="btn-long"
                            onClick={() => PostData()}>SIGN IN</button>

                        <div className="divider"></div>

                        <h6 className="txt-lower" style={{textAlign:"center"}}>Don't have an Account? <Link className="link" to='/Signup'>Signup</Link></h6>
                    </div>
                </div>

            </div>
            {/* <div className="card auth-card">
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
            </div> */}
        </div>
    )
}

export default Login;