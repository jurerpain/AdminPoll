import React, {Fragment, useEffect, useState} from "react";
import {useServer} from "../../context/server/serverProvider";
import Loader from "../Loader/Loader";
import {Badge, Button, Card, CardBody, CardHeader, Col, Collapse, Input, Label, Row, Table} from "reactstrap";
import useFormFields from "../../hooks/useFormFields";


const Logs = () => {
    const [users, setUsers] = useState(null);
    const [isFilter, setIsFilter] = useState(true);
    const [status, setStatus] = useState();
    const [fields, setFields] = useState({
        success: true,
        fail: true,
    })
    const {getAllUsers, getFilteredUsers} = useServer();

    const handleField = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFields({
            ...fields,
            [e.target.name]: val
        })
    }
    const handleFilter = () => {
        let filter = {};
        if (fields.success && (fields.success !== fields.fail)){
            filter.isSuccess = true
        }
        else if(fields.fail && (fields.success !== fields.fail)){
            filter.isSuccess = false
        }
        getFilteredUsers(filter).then((res) => {
            console.log(res)
            setUsers(res);
        })
    }
    // const users = getAllUsers();
    // console.log(users);
    useEffect(() => {
        getAllUsers().then((res) => {
            setFields({
                success: true,
                fail: true,
            })
            setUsers(res);
        })
    }, [])
    if (users === null) {
        return <Loader/>
    }
    return (
        <Fragment>
            <Col xl={3}>
                <div className="default-according style-1 faq-accordion users_filter" id="accordionoc">
                    <Row>
                        <Col xl="12">
                            <Card className={'o-hidden'}>
                                <CardHeader>
                                    <h5 className="mb-0">
                                        <Button color="link pl-0" data-toggle="collapse"
                                                onClick={() => setIsFilter(!isFilter)}
                                                data-target="#collapseicon" aria-expanded={isFilter}
                                                aria-controls="collapseicon">Filters</Button>
                                    </h5>
                                </CardHeader>
                                <Collapse isOpen={isFilter}>
                                    <CardBody className="animate-chk">
                                        <h5 className={'m-b-15'}>Filter by Status</h5>
                                        <div className="checkbox-animated">
                                            <Label className="d-block" htmlFor="status_ok">
                                                <Input className="checkbox_animated"
                                                       name={'success'}
                                                       id="status_ok"
                                                       type="checkbox"
                                                       checked={fields.success}
                                                onChange={handleField}/>
                                                {"Success"}
                                            </Label>
                                            <Label className="d-block" htmlFor="status_fail">
                                                <Input className="checkbox_animated"
                                                       id="status_fail"
                                                       name={'fail'}
                                                       type="checkbox"
                                                       checked={fields.fail}
                                                       onChange={handleField}
                                                />{"Fail"}
                                            </Label>
                                        </div>
                                        <Button color={'primary'}
                                                className={'m-t-20 text-center'}
                                                onClick={handleFilter}
                                        >
                                            Filter
                                        </Button>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col xl={9}>
                <Card className={'user_logs'}>
                    <CardHeader>
                        <h5>User logs</h5>
                    </CardHeader>
                    {
                        users.length > 0 ?
                            <div className="table-responsive">
                                <Table hover>
                                    <thead>
                                    <tr>
                                        <th scope="col">{}</th>
                                        <th scope="col">{"User ID"}</th>
                                        <th scope="col">{"Bank"}</th>
                                        <th scope="col">{"Status"}</th>
                                        <th scope="col">{"Amount"}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        users.map((user, index) => (
                                            <tr key={user.userID}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{user.userID}</td>
                                                <td>{user.bank}</td>
                                                <td>
                                                    {
                                                        user.isSuccess ?
                                                            <Badge color={'success'}> Success </Badge>
                                                            : <Badge color={'danger'}>Fail</Badge>
                                                    }
                                                </td>
                                                <td>{user.amount}</td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </Table>
                            </div> :
                            <CardBody>
                                <h1>Users not found</h1>
                            </CardBody>
                    }
                </Card>
            </Col>
        </Fragment>

    )
}
export default Logs;