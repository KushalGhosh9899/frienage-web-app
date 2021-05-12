import Conversation from '../screen/conversations/conversation';
import AllMessages from '../screen/message/message'
const Message = () => {
    return (
        <>
            <div class="message-div">
                <div className="conversation">
                    <div className="top-line">
                        <span className="span1 ">All Conversations 
                        <i class="material-icons">arrow_drop_down</i></span>
                    </div>
                    <Conversation />
                    <Conversation />
                    <Conversation />
                    <Conversation />
                    <Conversation />
                <a class="btn-floating btn-large waves-effect waves-light add-msg z-depth-5">
                    <i class="material-icons">add</i></a>
                </div>
                <AllMessages />
            </div>
        </>
    )
}

export default Message