const express = require('express')
const http = require('http')
const cors = require('cors')
const socketio = require('socket.io')

const {addUsers,removeUsers,getUser,getUserInRoom} = require('./users')

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();

app.use(cors());
const server = http.createServer(app);

const io = socketio(server,{
    cors:{
        origins:["http://localhost:3000"],
        handlePreflightRequest:(req,res,next)=>{
            res.writeHead(200,{
                "Access-Control-Allow-Origin":"http://localhost:3000",
                "Access-Control-Allow-Methods":"GET,POST",
                "Access-Control-Allow-Headers":"my-custom-header",
                "Access-Control-Allow-Credentials":true
            });
            res.end();
            next();
        }
    }
});

app.use(router);

io.on('connect',(socket)=>{
    //console.log('New User joined')

    socket.on('join', ({name,room},callback)=>{
        const {error,user} = addUsers({id:socket.id,name,room});
        if (error) return callback(error);
        
        socket.emit('message',{user:'Admin',text:`${user.name} Welcome to the ${user.room}`});
        socket.broadcast.to(user.room).emit('message',{user:'Admin',text:`${user.name} has joined`});
        socket.join(user.room);
        io.to(user.room).emit('roomData',{room:user.room ,users:getUserInRoom(user.room)})
        callback();
    })

    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('message',{user:user.name,text:message});
        io.to(user.room).emit('roomData',{room:user.room,users:getUserInRoom(user.room)});
        callback();
    })

    socket.on('disconnect',()=>{
        //console.log('User left')
        const user = removeUsers(socket.id);
        if(user) {
            io.to(user.room).emit('message',{user:'Admin',text:`${user.name} has left`})
        }
    })
})


server.listen(PORT,()=>console.log(`Server is running ${PORT}`))