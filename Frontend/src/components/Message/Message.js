import React from 'react'
import ReactEmoji from 'react-emoji'
import './Message.css'

const Message=({message:{user,text},name})=> {
    let isSentByCurrentUser = false;
    const trimnedName = name.trim().toLowerCase();

    if (user===trimnedName) {
        isSentByCurrentUser=true;
    }
    return (
        isSentByCurrentUser ? (
            <div className="message justifyEnd">
                <p className="senttext pr-10">{trimnedName}</p>
                <div className="messagebox backgroundBlue">
                    <p className="messagetext colorWhite">{ReactEmoji.emojify(text)}</p>
                </div>
            </div>

        ) :
        (
            <div className="message justifyStart">
                <div className="messagebox backgroundLight">
                    <p className="messagetext colorDark">{ReactEmoji.emojify(text)}</p>
                </div>
                <p className="senttext pl-10">{user}</p>
            </div>

        )
    )
}

export default Message
