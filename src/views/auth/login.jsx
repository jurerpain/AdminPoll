import React,{useState} from 'react';
import {Container,Row,Col,Form,FormGroup,Input,Label,Button,NavItem, NavLink, Nav,TabContent,TabPane} from 'reactstrap'
import { Password,SignIn, EmailAddress,RememberPassword,ForgotPassword, CreateAccount,FIREBASE,AUTH0,JWT,LoginWithJWT } from '../../constant';
import {useSelector} from "react-redux";
import {Link, useHistory} from "react-router-dom";
import {useForm, Controller} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {useAuth} from "../../context/auth/authProvider";
import {toast} from "react-toastify";


const schema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().min(8).required(),
});

const Login = ()  => {

    const {user, setUser,sign} = useAuth();
    const theme = useSelector( store => store.Customizer.theme);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema)
    });
    const history = useHistory();
    const onSubmit = async (data) => {
        console.log(data);
        setLoading(true);
        const login = await sign(data.email, data.password);

        if (!login.status){
            toast.error(login.msg,{
                position: toast.POSITION.TOP_CENTER
            })
            setLoading(false);

        }
        else {
            localStorage.setItem('user', login);
            setUser(login);
        }

    };
    if (user) {
        history.push('/admin');
    }
    return (
        <Container fluid={true}>
            <div className="auth">
                <div className="auth_container">
                    <div className="auth_content shadow-lg shadow-showcase">

                        <Form className="theme-form" onSubmit={handleSubmit(onSubmit)}>
                            <h4>{"Sign in"}</h4>
                            <FormGroup className={errors.email && 'is-invalid'}>
                                <Label className="col-form-label">{EmailAddress}</Label>
                                <Input {...register('email')} className={errors.email && 'is-invalid'} />
                            </FormGroup>
                            <FormGroup className={errors.password && 'is-invalid'}>
                                <Label className="col-form-label">{Password}</Label>
                                <Input  type="password" {...register('password')} className={errors.password && 'is-invalid'}/>
                            </FormGroup>
                            <Button color="primary" className="btn-block" >
                                {loading ? 'Loading...': SignIn }
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Login;