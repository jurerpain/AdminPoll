import React from "react";
import Dashboard from "../../views/dashboard/Dashboard";
import {useCustomizer} from "../../hooks/useCustomizer";
import {useAuth} from "../../context/auth/authProvider";
import Loader from "../../layouts/loader";
import {Redirect, Route, Switch} from 'react-router-dom';
import Error404 from "../../layouts/error/404";
import Login from '../../views/auth/login';
import Auth from '../../views/auth/auth';
import Register from "../../views/auth/register";
import ResetPass from "../../views/auth/forgot";


const App = () => {
    const { user } = useAuth();
    useCustomizer();

    if(user === null) {
        return <Loader/>
    }
    return (
        <>
            <Switch>
                <Route exact path='/auth/login' component={Login}/>
                <Route exact path='/auth/register' component={Register}/>
                <Route exact path='/auth/forgot' component={ResetPass}/>
                <Route exact path='/auth/action' component={Auth}/>
                <Route path='/auth'><Redirect to='/auth/login'/></Route>
                <Route path='/admin' component={Dashboard}/>
                <Route render={ () => <Error404 path='/'/> }/>
            </Switch>
        </>
    )
}

export default App;