import './message.css';
import { format } from 'timeago.js';

const AllMessages = ({ text, sender }) => {
    // console.log(text)

    return (
        <div className={sender}>

            <img src={text.senderPic} />

            <div className="message-content">
                <span className="message-txt">{text.text}</span>
                <time>{format(text.createdAt)}</time>
            </div>
        </div>

    )
}

export default AllMessages