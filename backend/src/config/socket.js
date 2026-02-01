import {Server} from "socket.io";

let io;

export const initSocket=(server)=>{
    io=new Server(server,{
        cors:{
            origin:[ "http://localhost:5173","http://admin.localhost:5173"],
        }
    })

    io.on("connection",(socket)=>{
        console.log("User Connected",socket.id);

        socket.on("disconnect",()=>{
            console.log("User Disconnect",socket.id);
        });
    });

    return io;
}


export const getIo=()=>{
    if(!io){
        throw new Error ("Socket not Corrected");
    }
    return io;
}

