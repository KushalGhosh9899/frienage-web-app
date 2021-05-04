import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { userContext } from '../../App';
import footerImage from '../../images/footerimage.svg';
import footerLogo from '../../images/together.png';

const Footer = () => {
    const { state, dispatch } = useContext(userContext);
    return (
        <div>
            <footer className="page-footer">
                <div className="container">
                    <div className="row footer-row">
                        <div className="col l5 s12">
                            <img src={footerLogo} className="footer-logo"></img>
                            <h5 ><Link className="footer-text-main-heading" to={state ? "/" : "/startup"}>Friengage</Link></h5>
                            <p className="footer-text-sub">Stay Engaged! with Friengage</p>
                            <div className="icons-link">

                            </div>
                        </div>
                        <div className="col l2 s12">
                            <h5 className="footer-text-heading">Quick Links</h5>
                            <ul>
                                <li className="list-items"><a className="footer-text links" href="#!">About Us</a></li>
                                <li className="list-items"><a className="footer-text links" href="#!">Our Team</a></li>
                                <li className="list-items"><a className="footer-text links" href="#!">Contact Us</a></li>
                                <li className="list-items"><a className="footer-text links" href="#!">Home</a></li>
                            </ul>
                        </div>
                        <div className="col l2  s12">
                            <h5 className="footer-text-heading">Help</h5>
                            <ul>
                                <li className="list-items"><a className="footer-text links" href="#!">Support</a></li>
                                <li className="list-items"><a className="footer-text links" href="#!">Terms and Condition</a></li>
                                <li className="list-items"><a className="footer-text links" href="#!">Privacy Policy</a></li>
                                <li className="list-items"><a className="footer-text links" href="#!">Data Policy</a></li>
                            </ul>
                        </div>
                        <div className="col l3  s12">
                            <img src={footerImage} alt="forget-svg" className="other-svg responsive-img" />
                            <span className="contact-span"><a className="contact-links" href="mailto:contact@friengage.com">
                                <i className="material-icons contact-icon">email</i>
                            contact@friengage.com</a><br /></span>
                            <span className="contact-span" ><a className="contact-links" href="tel:1234567890"><i className="material-icons contact-icon">
                                call</i>(+91) 123 456 7890</a></span>

                        </div>
                    </div>
                </div>
                <div className="container footer-container">
                    <div className="divider footer-divider"></div>
                    <a className="footer-text">
                        ©2021 Copyright Friengage
                    </a>
                    <a className="footer-text right" href="https://github.com/KushalGhosh9899">
                        Developed by Kushal Ghosh</a>
                </div>
            </footer>
        </div>
    )
}
export default Footer;