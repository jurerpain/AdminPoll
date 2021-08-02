import React, {Fragment} from 'react';
import {Provider} from "react-redux";
import store from "./store";
import {BrowserRouter} from "react-router-dom";
// import {firebaseInitialize} from "./services/firebase";
import {ProvideAuth} from "./context/auth/authProvider";
import {ToastContainer} from 'react-toastify'
import {SocketProvider} from "./context/socket/socketProvider";
import {ServerProvider} from "./context/server/serverProvider";

// firebaseInitialize();

const Providers = ({children}) => {
    return (
        <Fragment>
            <Provider store={store}>
                <ProvideAuth>
                    <ServerProvider>
                        <SocketProvider>
                            <BrowserRouter basename='/'>
                                {children}
                                <ToastContainer/>
                            </BrowserRouter>
                        </SocketProvider>
                    </ServerProvider>
                </ProvideAuth>
            </Provider>
        </Fragment>
    )
}
export default Providers;
