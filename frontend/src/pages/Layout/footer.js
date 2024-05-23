import React from "react";
import { Link } from "react-router-dom";
import "../styles/root.css"
import "./footer.css";

const Footer = () => {
    return (
        <>
        <div className="footer-stuff">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#BCA79D" fillOpacity="1" d="M0,128L26.7,133.3C53.3,139,107,149,160,138.7C213.3,128,267,96,320,101.3C373.3,107,427,149,480,192C533.3,235,587,277,640,277.3C693.3,277,747,235,800,202.7C853.3,171,907,149,960,160C1013.3,171,1067,213,1120,208C1173.3,203,1227,149,1280,122.7C1333.3,96,1387,96,1413,96L1440,96L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"></path></svg>
            <div className="footer">            
                <div className="footer-row">
                    <h2 className="footer-row_name">Links</h2>
                    <ul>
                        <li><a href="https://github.com/germanProgq" target="_blank">GitHub</a></li>
                        <li><a href="https://germanvinok.online" target="_blank">Creator</a></li>
                        <li><Link to="/">Home</Link></li>
                        <li><a href="https://open.spotify.com/user/31mqz3mdsvm65olcyqvtrgzxfdly" target="_blank">Music</a></li>
                    </ul>
                </div>
                <div className="footer-row">
                    <h2 className="footer-row_name">Vibe</h2>
                    <ul>
                        <li><a href="https://codepen.io/germanProgq" target="_blank">Codepen</a></li>
                        <li><Link to="/">Home</Link></li>
                    </ul>
                </div>  
                <div className="footer-row">
                    <h2 className="footer-row_name">Business</h2>
                    <ul>
                        <li><a href="https://github.com/germanProgq">Copyright</a></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/generate/password">Generate a password</Link></li>
                        <li><Link to="/sponsor">Become a sponsor</Link></li>
                    </ul>
                </div> 
                <div className="footer-row">
                    <h2 className="footer-row_name">Support Team</h2>
                    <ul>
                        <li><a href="https://germanvinok.online" target="_blank">Creator</a></li>
                        <li><Link to="/user/tickets">Tickets</Link></li>  
                        <li><Link to="/user/tickets/create">Open a ticket</Link></li>                     
                    </ul>
                </div>           
            </div>
        </div>
        </>
    )
}
export default Footer