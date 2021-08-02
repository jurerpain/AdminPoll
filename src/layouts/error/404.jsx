import React, {Fragment} from 'react';
import sad from '../../assets/images/other-images/sad.png';
import {Link} from 'react-router-dom';
import {Button, Col, Container, Media} from "reactstrap"

const Error404 = ({path = "/", text="Back to home"}) => {
    return (
        <Fragment>
            <div className="page-wrapper">
                <div className="error-wrapper">
                    <Container>
                        <Media body className="img-100" src={sad} alt="" />
                        <div className="error-heading">
                            <h2 className="headline ">{"404"}</h2>
                        </div>
                        <Col md="8 offset-md-2">
                            <p className="sub-content">{"The page you are attempting to reach is currently not available. This may be because the page does not exist or has been moved."}</p>
                        </Col>
                        <Link to={`${process.env.PUBLIC_URL}${path}`}><Button color="primary" size='lg'>{text}</Button></Link>
                    </Container>
                </div>
            </div>
        </Fragment>
    );
};

export default Error404;