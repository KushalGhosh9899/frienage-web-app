import { useContext, useEffect, useRef, useState } from 'react';
import Conversation from '../screen/conversations/conversation';
import AllMessages from '../screen/message/message'
import { userContext } from '../../App';
import { io } from 'socket.io-client';
import { useHistory } from 'react-router-dom';


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
    const scrollRef = useRef();
    const socket = useRef();
    const history = useHistory();
    let cid = null;
    let newcid = null;
    const [currentID, setCurrentID] = useState(null);


    useEffect(() => {
        cid = history.location.search;
        newcid = cid.replace('?id=', '');
        socket.current = io('ws://localhost:8900');
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    }, [])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.current.emit("addUser", userid._id)
        socket.current.on("getUsers", users => {
            // console.log(users)
        })
    }, [userid])


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
            senderPic:userid.pic
        }
        const receiverId = currentChat.members.find(member => member !== userid._id)
        socket.current.emit("sendMessage", {
            senderId: userid._id,
            receiverId,
            text: newMessage,
            senderPic:userid.pic
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

    useEffect(() => {
        let friendId = null
        if (currentChat) {
            friendId = currentChat.members.find(member => member !== userid._id)
        }
        // console.log(friendId)   

        fetch(`/user/${friendId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(result => {
                // console.log("result = ",result.user)
                setCurrentID(result.user)
            })
    }, [currentChat])
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
                                <span>Chatting with  
                                    <span>{currentID?' '+currentID.name:'..loading'}</span></span>
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
                            {
                                currentID ?

                                    <div className="message-profile">
                                        <img src={currentID.pic} />
                                        <span className="name">{currentID.name}</span>
                                        <span className="email">{currentID.email}</span>
                                    </div>
                                    :
                                    '..loading'

                            }
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