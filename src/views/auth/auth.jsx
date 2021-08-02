import React from "react";
import {useHistory} from "react-router-dom";
import {useAuth} from "../../context/auth/authProvider";
import ResetPassword from "./resetPassword";

const Auth = () => {
    const {user} = useAuth();
    const history = useHistory();

    const url = new URL(window.location)

    if (url.searchParams.has(url.searchParams.has('oobCode') && 'mode')){
        const mode = url.searchParams.get('mode'),
            oobCode = url.searchParams.get('oobCode');
        console.log(mode,oobCode);

        switch (mode) {
            case 'resetPassword':
                return(
                    <ResetPassword code={oobCode}/>
                )
        }
    }
    if (user) {
        history.push('/');
    } else {
        history.push('/auth/login');
    }
    return (
        <></>
    )

}

export default Auth;