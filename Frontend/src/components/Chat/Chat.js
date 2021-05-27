import React,{useState,useEffect} from 'react'
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css'
import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'

let socket;

const Chat=({location})=> {

    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [message,setMessage] = useState('')
    const [messages,setMessages] = useState([])

    const ENDPOINT = 'https://chatseem.herokuapp.com/';
    //const ENDPOINT ='http://localhost:5000';

    useEffect(()=>{
        const {name,room} = queryString.parse(location.search);
         socket = io(ENDPOINT,{
            withCredentials:false,
            transportOptions:{
                polling:{
                    extraHeaders:{
                        "my-custom-header":"abcd"
                    }
                }
            }
        })
        setName(name);
        setRoom(room);
        //console.log(socket)
        socket.emit('join',{name,room},()=>{

        });
        return ()=>{
            socket.emit('disconnect')
            socket.off()
        }

    },[ENDPOINT,location.search]);

    useEffect( ()=>{
        socket.on('message',(message)=>{
            setMessages([...messages,message]);
        })
    },[messages])

    // Function for sending messages

    const sendMessage = (event) =>{
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage',message,()=>setMessage(''));
        }
    }

    console.log(message,messages);

    return (
        <div className="OuterContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
        </div>
    )
}

export default Chat