import React,{useState} from 'react';
import {Container,Row,Col,Form,FormGroup,Input,Label,Button,NavItem, NavLink, Nav,TabContent,TabPane} from 'reactstrap'
import { Password,SignIn, EmailAddress,RememberPassword,ForgotPassword, CreateAccount,FIREBASE,AUTH0,JWT,LoginWithJWT } from '../../constant';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import {useAuth} from "../../context/auth/authProvider";
import * as yup from "yup";
import {CheckCircle} from "react-feather";
const schema = yup.object().shape({
    email: yup.string().email().required(),
});


const ResetPass = (props)  => {
    const {user, sendResetEmail} = useAuth();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema)
    });
    const history = useHistory();
    const onSubmit = (data) => {
        console.log(data);
        sendResetEmail(data.email).then( (res) => {
            console.log(res);
            if (res.name === 'FirebaseError'){
                let errMsg = '';
                switch (res.code){
                    case 'auth/user-not-found':
                        errMsg = 'User with this email was not found.';
                        break;
                    default:
                        errMsg = `Error: ${res.code}`;
                        break;
                }
                toast.error(errMsg, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
            else if (res){
                setStatus(true);
                toast.success('Message was send! Check out email.',{
                    position: toast.POSITION.TOP_CENTER
                })
                setTimeout(() => {
                    history.push('/auth/login');
                },1500)
            }
        })
    };
    if (user) {
        history.push('/');
    }
    return (
        <Container fluid={true}>
            <div className="auth">
                <div className="auth_container">
                    <div className="auth_content forgot shadow-lg shadow-showcase">
                        {status ? <CheckCircle color='#51bb25' size='64'/> :
                            <Form className="theme-form" onSubmit={handleSubmit(onSubmit)}>
                                <h4>{"Reset Password"}</h4>
                                <FormGroup className={errors.email && 'is-invalid'}>
                                    <Label className="col-form-label">{EmailAddress}</Label>
                                    <Input {...register('email')} className={errors.email && 'is-invalid'}/>
                                </FormGroup>
                                <Button color="primary" className="btn-block">{"Reset password"}</Button>
                            </Form>
                        }
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default ResetPass;