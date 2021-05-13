import { useContext, useEffect, useRef, useState } from 'react';
import Conversation from '../screen/conversations/conversation';
import AllMessages from '../screen/message/message'
import { userContext } from '../../App';
import {io} from 'socket.io-client';


const Message = () => {
    document.title = "All Messages";
    const { state, dispatch } = useContext(userContext);
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [convoID, setConvoID] = useState(null);
    const [messages, setMessages] = useState([]);
    const userid = JSON.parse(localStorage.getItem("user"));
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef()
    const socket = useRef()

    useEffect(()=>{
        socket.current = io('ws://localhost:8900');
        socket.current.on("getMessage",data=>{
            setArrivalMessage({
                sender:data.senderId,
                text:data.text,
                createdAt:Date.now()
            })
        })
    },[])

    useEffect(()=>{
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)&&
        setMessages((prev)=>[...prev,arrivalMessage])
    },[arrivalMessage,currentChat])

    useEffect(()=>{
        socket.current.emit("addUser",userid._id)
        socket.current.on("getUsers",users=>{
            // console.log(users)
        })
    },[userid])


    useEffect(() => {
        const getdata = async () => {
            await fetch(`/conversation/${userid._id}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json",
                }
            }).then(res => res.json())
                .then(result => {
                    setConversations(result.data);
                    // console.log(result.data)
                })
        }
        getdata()
    }, [])
    // console.log(currentChat)

    useEffect(() => {        
        fetch(`/message/${convoID}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json",
            }
        }).then(res => res.json())
            .then(result => {
                setMessages(result.data);
                // console.log(messages)
            })
    }, [currentChat])

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = {
            conversationId: currentChat._id,
            sender: userid._id,
            text: newMessage,
        }
        const receiverId = currentChat.members.find(member=> member!==userid._id)
        socket.current.emit("sendMessage",{
            senderId:userid._id,
            receiverId,
            text:newMessage
        })

        fetch('/message', {
            method: "post",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: message
            })
        })
            .then(res => res.json())
            .then(result => {
                setMessages([...messages, result.data])
                // setConversations(result.data);
                // console.log(result.data)
                setNewMessage('')
            })
    }


    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [messages])

    return (
        <>
            <div class="message-div">
                <div className="conversation">
                    <div className="top-line">
                        <span className="span1 ">All Conversations
                        <i class="material-icons">arrow_drop_down</i></span>
                    </div>
                    {
                        conversations.map((item) => (
                            <div onClick={() => {
                                setCurrentChat(item)
                                setConvoID(item._id)
                            }}>
                                <Conversation conversation={item} currentUser={userid._id} />
                            </div>


                        ))
                    }
                    <a class="btn-floating btn-large waves-effect waves-light add-msg z-depth-5">
                        <i class="material-icons">add</i></a>
                </div>
                {
                    currentChat ?

                        <div className="message-section">
                            <div className="message-box">
                                <div className="messages">
                                    {
                                        messages.map((item) => (
                                            <div ref={scrollRef}>
                                                <AllMessages text={item} sender={
                                                    item.sender == userid._id ?
                                                        "you" :
                                                        "another"
                                                } />
                                            </div>

                                        ))
                                    }
                                </div>

                                <div className="send-msg-button">
                                    <div class="input-field col s6 text-fields">
                                        <form id="msg-box" onSubmit={handleSubmit}>
                                            <input id="msg-box2"
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                value={newMessage}
                                                className="text-input send-msg-box" type="text"
                                                placeholder="Type Your Message" />
                                            <button type="submit" className="waves-effect btn-flat send-msg-btn">
                                                <i class="material-icons">send</i>
                                            </button>

                                        </form>

                                    </div>
                                </div>

                            </div>

                            {/* Profile Info of Sender */}
                            <div className="message-profile">
                                <img src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" />
                                <span className="name">Kushal Ghosh</span>
                                <span className="email">@kushalghosh9899@gmail.com</span>
                            </div>
                        </div>

                        :
                        <div className="select-convo">
                            <span>Select a Conversation to view Chats</span>
                        </div>


                }
            </div>
        </>
    )
}

export default Message