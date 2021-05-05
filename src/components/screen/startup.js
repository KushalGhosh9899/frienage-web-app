import { Link } from 'react-router-dom';
import {useState} from 'react';
import screen1 from '../../images/startupscreen1.svg';
import groupchat from '../../images/groupchat.svg';
import yourupdates from '../../images/postyourupdates.svg';
import manageprofile from '../../images/profilesetup.svg';
import viewposts from '../../images/viewuploadphotos.svg';
import buildcommunity from '../../images/buildcommunity.svg';
import followfriends from '../../images/addfriend.svg';
import messaging from '../../images/realtimemessaging.svg';


const Startup = () => {
    document.title = "Friengage";
    
    const [topBtnVisible,SetTopBtnVisible] = useState(false);
    const topBtnVisibility = () =>{
       if(window.scrollY >= 300){
        SetTopBtnVisible(true);
       }
       else{
        SetTopBtnVisible(false);
       }
    };
    window.addEventListener('scroll', topBtnVisibility);

    return (
        <div id="top">
            <div className="startup-container">
                <div className="container">
                    <div className="row" style={{ height: "91vh" }}>
                        <div className="col s12 m6 l6 side1">
                            <p>
                                <span className="black-txt">Stay</span> <span className="blue-txt">Engaged!</span><br />
                                <span className="black-txt">with</span><br />
                                <span className="blue-txt">Fri</span>
                                <span className="black-txt">ENG</span>
                                <span className="blue-txt">age</span><br />
                            </p>
                            <p className="startup-para" style={{ marginBottom: "10%" }}>
                                Anyone willing to get acquainted and communicate <br />
                        can use it for free and use without limits.

                        </p>
                            <Link to="/signup">
                                <button className="btn-default dark waves-effect waves-light z-depth-5">
                                    let's engage</button></Link>
                        </div>

                        <a href="#nextregion" className="btn-floating btn-large waves-effect waves-light float-btn z-depth-4">
                            <i className="material-icons">arrow_downward</i></a>

                        <div className="col s12 m6 l6 side2">
                            <img src={screen1} alt="screen1" className="screen1 responsive-img" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">

                {/* Scroll to top button */}
                <a className={topBtnVisible?"visble-true ":"visble-false"}>
                <a href="#top" className="btn-floating btn-large waves-effect waves-light top-btn z-depth-5">
                    <i className="material-icons">arrow_upward</i></a>
                </a>

                <div className="row" id="nextregion" style={{ marginBottom: "15%" }}>
                    <h2 className="featured-head">Features</h2>
                    <div className="col s12 m6 l8">
                        <img src={groupchat} alt="group-chat" className="features-svg responsive-img" />
                    </div>
                    <div className="col s12 m6 l4 row-st" >
                        <h4 className="featured-sub-head"><i className=" material-icons featued-icon">videocam</i>Video Conferencing</h4>
                        <p className="featured-para">
                            Users can add different Friends in their Video Chat and it is a real-time ongoing process.
                        </p>
                    </div>
                </div>

                <div className="row startup-row">
                    <div className="col s12 m6 l4 row-st" style={{ marginTop: "10%!important" }}>
                        <h4 className="featured-sub-head">
                            <i className=" material-icons featued-icon">message</i>Real Time Messaging</h4>
                        <p className="featured-para">
                            Users can Message each other in real-time.
                        </p>

                    </div>
                    <div className="col s12 m6 l8" >
                        <img src={messaging} alt="group-chat" className="features-svg responsive-img" />
                    </div>
                </div>

                <div className="row startup-row" >
                    <div className="col s12 m6 l8">
                        <img src={followfriends} alt="group-chat" className="features-svg responsive-img" />
                    </div>
                    <div className="col s12 m6 l4 row-st">
                        <h4 className="featured-sub-head"><i className=" material-icons featued-icon">group_add</i>Follow Friends</h4>
                        <p className="featured-para">
                            Users can Follow others to view their Updates.
                        </p>
                    </div>
                </div>

                <div className="row startup-row" >
                    <div className="col s12 m6 l4  row-st">
                        <h4 className="featured-sub-head">
                            <i className=" material-icons featued-icon">people</i>Build Community</h4>
                        <p className="featured-para">
                            Users can connect to each other and share Updates to make their own community
                        </p>

                    </div>
                    <div className="col s12 m6 l8" >
                        <img src={buildcommunity} alt="group-chat" className="features-svg responsive-img" />
                    </div>
                </div>

                <div className="row startup-row" >
                    <div className="col s12 m6 l8">
                        <img src={viewposts} alt="group-chat" className="features-svg responsive-img" />
                    </div>
                    <div className="col s12 m6 l4 row-st">
                        <h4 className="featured-sub-head"><i className=" material-icons featued-icon">cloud_upload</i>View/ Upload Posts</h4>
                        <p className="featured-para">
                            Users can Upload Photos and can view others Post too.
                        </p>
                    </div>
                </div>

                <div className="row startup-row" >
                    <div className="col s12 m6 l4  row-st" >
                        <h4 className="featured-sub-head">
                            <i className=" material-icons featued-icon">settings</i>Managing Profile</h4>
                        <p className="featured-para">
                            Users can Manage their Profile by Updating their Details.
                        </p>

                    </div>
                    <div className="col s12 m6 l8" >
                        <img src={manageprofile} alt="group-chat" className="features-svg responsive-img" />
                    </div>
                </div>

                <div className="row startup-row" >
                    <div className="col s12 m6 l8">
                        <img src={yourupdates} alt="group-chat" className="features-svg responsive-img" />
                    </div>
                    <div className="col s12 m6 l4 row-st">
                        <h4 className="featured-sub-head"><i className=" material-icons featued-icon">cake</i>Post Updates</h4>
                        <p className="featured-para">
                            You can post your Achievments, Updates here so that World knows about you.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Startup;