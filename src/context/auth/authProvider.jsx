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
    const [user, setUser] = useState(null);
    const url = `${process.env.REACT_APP_API_URL}`
    // Wrap any Firebase methods we want to use making sure ...
    // ... to save the user to state.
    async function checkAuth(){
        const res = await fetch(`${url}/auth/check`,{
            credentials: 'include',
        }).then((res) => {
            if (res.status === 401){
                setUser(false);
            }else if (res.status === 202){
                setUser(true)
            }
        })

    }
    async function sign(login, password) {
        const str = btoa(`${login}:${password}`);
            const res = await fetch (`${url}/auth`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `basic ${str}`
            },
        })
        console.log(res.status)
        return res.status;
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
        checkAuth();
    }, []);
    // Return the user object and auth methods
    return {
        user,
        setUser,
        sign,
        signout,
    };
}