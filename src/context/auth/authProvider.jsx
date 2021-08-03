import React, {createContext, useContext, useEffect, useState} from "react";



import {useDispatch} from "react-redux";
import {USER_AUTH} from "../../redux/actionTypes";

const authContext = createContext();

export function ProvideAuth({children}) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    const dispatch = useDispatch();
    const [user, setUser] = useState(localStorage.getItem('user') || false);
    const url = 'http://api.poladmin.pp.ua/auth'
    // Wrap any Firebase methods we want to use making sure ...
    // ... to save the user to state.
    async function sign(login, password) {
        const res = await fetch (url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login, password
            })
        })
        return await res.json();
    }

    const signout = () => {
        localStorage.removeItem('user');
        setUser(false)
    };


    // Subscribe to user on mount
    // Because this sets state in the callback it will cause any ...
    // ... component that utilizes this hook to re-render with the ...
    // ... latest auth object.
    useEffect(() => {
        // TODO: Optimize requests

    }, []);
    // Return the user object and auth methods
    return {
        user,
        setUser,
        sign,
        signout,
    };
}