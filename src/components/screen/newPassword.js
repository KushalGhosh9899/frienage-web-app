import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';
import forgetImage from '../../images/changepassword.svg';

const NewPassword = () => {
    document.title = "Reset Password | Friengage";
    const History = useHistory();
    const [password, setPassword] = useState("");
    const { token } = useParams();
    const PostData = () => {
        fetch("/new-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                token
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#e53935 red darken-1" });
                }
                else {
                    M.toast({ html: data.message, classes: "#00c853 green accent-4" });
                    History.push('/login');
                }
            })
    }
    return (
        <div>
            <div className="login-container">
                <div className="other">
                    <img src={forgetImage} alt="forget-svg" className="other-svg responsive-img" />
                </div>
                <div className="login-card">
                    <div>
                        <h2 className="top-heading">Reset</h2>
                        <h5 style={{ textAlign: "center" }}>Create your new Password</h5>
                        {/* For Password Input Field */}
                        <div class="input-field col s6 text-fields">
                            <i class="material-icons prefix">account_circle</i>
                            <input className="text-input" type="password" placeholder="Enter your new Password" value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button className="btn-long"
                            onClick={() => PostData()}>CHANGE PASSWORD</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewPassword;