import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import forgetImage from '../../images/forgetpassword.svg';

const Reset = () => {
    document.title = "Reset Password | Friengage";
    const History = useHistory();
    const [email, setEmail] = useState("");
    const PostData = () => {
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            M.toast({ html: "Invalid Email", classes: "#e53935 red darken-1" });
            return
        }
        fetch('/reset-password', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
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
                        <h5 style={{ textAlign: "center" }}>Reset your Password from Here</h5>
                        {/* For Email Input Field */}
                        <div class="input-field col s6 text-fields">
                            <i class="material-icons prefix">account_circle</i>
                            <input className="text-input" type="email" placeholder="Enter your Email ID" value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <button className="btn-long"
                            onClick={() => PostData()}>RESET PASSWORD</button>

                        <div className="divider"></div>

                        <h6 className="txt-lower" style={{ textAlign: "center" }}
                        >Already have an Account? <Link className="link" to='/login'>Login</Link></h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reset;