import './message.css';
import {format} from 'timeago.js'

const AllMessages = ({ text , sender}) => {
    return (
            <div className={sender}>
                <img src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" />

                <div className="message-content">
                    <span className="message-txt">{text.text}</span>
                    <time>{format(text.createdAt)}</time>
                </div>
            </div>

    )
}

export default AllMessages