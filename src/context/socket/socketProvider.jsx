import React, {createContext, useContext, useEffect, useState} from "react";
import {io} from "socket.io-client";

const socketContext = createContext();
const socket = io('http://localhost:3301',{
    autoConnect: false
});
export const SocketProvider = ({children}) => {
    const socket = useProvideSocket();
    return <socketContext.Provider value={socket}>{children}</socketContext.Provider>
}
export const useSocket = () => {
    return useContext(socketContext);
}

const useProvideSocket = () =>{
    socket.on('update_users', (users) => {
        console.log('Users update');
        setUsers(users);
    })
    const connect = () => {
        socket.connect();
        socket.emit('get_all_users', (res)=>{
            setUsers(res);
        })
    }
    const disconnect = () => {
        socket.disconnect();
    }

    const handleAction = (action, args) => {
        socket.emit(action, args.id);
    }
    const updateUser = (status, id, args = null) => {
        socket.emit('update_user', {
            status,id,args
        })
    }
    const deleteUser = (id) => {
        socket.emit('delete_user', id);
    }

    const [users, setUsers] = useState(null);


    return {
        users,
        connect,
        disconnect,
        handleAction,
        updateUser,
        deleteUser
    }
}