import React,{useState} from 'react';
import {Container,Row,Col,Form,FormGroup,Input,Label,Button,NavItem, NavLink, Nav,TabContent,TabPane} from 'reactstrap'
import { Password,SignIn, SignUp, EmailAddress, ConfirmPassword,RememberPassword,ForgotPassword, CreateAccount,FIREBASE,AUTH0,JWT,LoginWithJWT } from '../../constant';
import { GitHub, Facebook,Twitter } from 'react-feather';
import loginImg from '../../assets/images/auth-img.svg';
import logo from '../../assets/images/logo/logo.png';
import logoDark from '../../assets/images/logo/logo_dark.png';
import {useSelector} from "react-redux";
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../../context/auth/authProvider";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {toast} from "react-toastify";

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    confirmPassword: yup.mixed().oneOf([yup.ref('password')], null)
});
const Register = (props)  => {
    const {user, signup} = useAuth();
    const [loading, setLoading] = useState(false)
    const history = useHistory();
    const theme = useSelector( store => store.Customizer.theme);
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema)
    });
    const onSubmit = (data) => {
        console.log(data);
        signup(data.email, data.password).then( ( res ) => {
            console.log(res);
            if (res.name === 'FirebaseError'){
                let ErrorText = '';
                switch (res.code){
                    case 'auth/too-many-requests':
                        ErrorText = 'Too many requests. Please try again later.';
                        break;
                    case 'auth/email-already-in-use' :
                        ErrorText = 'This Email already in use.'
                        break;
                    default:
                        ErrorText = `Error: ${res.code}`;
                        break;
                }
                toast.error(ErrorText, {
                    position: toast.POSITION.TOP_CENTER
                });
                // eslint-disable-next-line no-unused-expressions
                document.querySelector('input[name="password"]').value = '';
                document.querySelector('input[name="confirmPassword"]').value = '';
            }


        });
    };
    if(user){
        history.push('/');
    }
    return (
        <Container fluid={true}>
            <div className="auth">
                <div className="auth_container">
                    <div className="auth_content shadow-lg shadow-showcase">
                        <Form className="theme-form" onSubmit={handleSubmit(onSubmit)}>
                            <h4>{"Sign Up"}</h4>
                            <FormGroup className={errors.email && 'is-invalid'}>
                                <Label className="col-form-label">{EmailAddress}</Label>
                                <Input {...register('email')} className={errors.email && 'is-invalid'}/>
                            </FormGroup>
                            <FormGroup className={errors.password && 'is-invalid'}>
                                <Label className="col-form-label">{Password}</Label>
                                <Input {...register('password')} type="password" className={errors.password && 'is-invalid'} />
                            </FormGroup>
                            <FormGroup className={errors.confirmPassword && 'is-invalid'}>
                                <Label className="col-form-label">{ConfirmPassword}</Label>
                                <Input {...register('confirmPassword')} type="password" className={errors.confirmPassword && 'is-invalid'} />
                            </FormGroup>

                            <Button color="primary" className="btn-block" >
                                {loading ? 'Loading...' : SignUp}
                            </Button>
                        </Form>
                        <div className="auth_content_right">
                            <div className="box">
                                <div>
                                    <h1>Welcome</h1>
                                    <p>Already have an Account? Sign In.</p>
                                    <Link to={"/auth/login"} color={theme === 'dark' ? "primary" : "secondary"} className="btn-block" >{SignIn}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Register;