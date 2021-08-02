import React, {createContext, useContext, useEffect, useState} from "react";

const serverContext = createContext();
export const ServerProvider = ({children}) => {
    const server = useProvideServer();
    return <serverContext.Provider value={server}>{children}</serverContext.Provider>
}
export const useServer = () => {
    return useContext(serverContext);
}

const useProvideServer = () =>{

    const _url = 'http://localhost:3301/api'


    const getAllUsers = async () => {
        const users = await fetch(`${_url}/get_users`, {
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return await users.json();
    }

    const getFilteredUsers = async (filter) => {
        const users = await fetch(`${_url}/get_users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter
            })
        })
        return await users.json();
    }

    return {
        getAllUsers,
        getFilteredUsers
    }
}