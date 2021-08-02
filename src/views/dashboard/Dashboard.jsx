import React, {Fragment} from 'react';
import Header from '../../layouts/header'
import Sidebar from '../../layouts/sidebar'
import Footer from '../../layouts/footer'
import {useRequireAuth} from "../../hooks/useRequiredAuth";
import {Button, Container, Row} from "reactstrap";
import userData from "../../api/userData";
import {Route, Switch} from "react-router-dom";
import UsersList from "../../components/UsersList";
import Logs from "../../components/Logs";

// import {ToastContainer} from 'react-toastify';
// import {useRequireAuth} from '../authProvider/useRequiredAuth';

const Dashboard = (props) => {
    useRequireAuth();
    const userApi = new userData();
    // console.log(props);
    console.warn = () => {}
    return (
        <Fragment>
            {/* <Loader/> */}
            <div className="page-wrapper compact-wrapper" id="pageWrapper">
                <Header/>
                <div className="page-body-wrapper sidebar-icon">
                    <Sidebar/>
                    <div className="page-body">
                        {/*{props.children}*/}
                        <Container fluid className={'p-t-20'}>
                            <Row>
                                <Switch>
                                    <Route exact path='/admin' component={UsersList}/>
                                    <Route exact path={'/admin/logs'} component={Logs}/>
                                </Switch>
                            </Row>
                        </Container>

                    </div>
                    <Footer/>
                </div>
            </div>
            {/*<ThemeCustomize/>*/}
            {/*<ToastContainer/>*/}
        </Fragment>
    );
}

export default Dashboard;