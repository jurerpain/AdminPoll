import React, {useEffect, useState} from 'react';
import {Container,Row,Col,Form,FormGroup,Input,Label,Button,NavItem, NavLink, Nav,TabContent,TabPane} from 'reactstrap'
import {
    Password,
    SignIn,
    EmailAddress,
    RememberPassword,
    ForgotPassword,
    CreateAccount,
    FIREBASE,
    AUTH0,
    JWT,
    LoginWithJWT,
    ConfirmPassword
} from '../../constant';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import {useAuth} from "../../context/auth/authProvider";
import * as yup from "yup";
import {AlertCircle} from "react-feather";

const schema = yup.object().shape({
    password: yup.string().min(8).required(),
    confirmPassword: yup.mixed().oneOf([yup.ref('password')], null)
});


const ResetPassword = ({code})  => {
    const [status, setStatus] = useState(null);
    const {verifyCode, confirmResetPassword} = useAuth();
    const [email, setEmail] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        verifyCode(code)
            .then((res) => {
                if (res.name === 'FirebaseError'){
                    setStatus(false);
                    let ErrMsg = '';
                    switch (res.code){
                        case 'auth/expired-action-code':
                            ErrMsg = 'Expired code. Get new code.';
                            break;
                        case 'auth/invalid-action-code' :
                            ErrMsg = 'Invalid code.';
                            break;
                        default:
                            ErrMsg = `Something went wrong. ${res.code}`;
                            break;
                    }
                    toast.error(ErrMsg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
                else {
                    setStatus(true);
                    setEmail(res);
                    console.log(res);
                }
            });
    }, []);


    const history = useHistory();
    const onSubmit = (data) => {
        console.log(data);
        confirmResetPassword(code, data.password)
            .then((res) => {
                if (res.name === 'FirebaseError'){
                    let errMsg = '';
                    switch (res.code) {
                        default:
                            errMsg = `Error: ${res.code}`;
                            break;
                    }
                    toast.error(errMsg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
                else {
                    toast.success('Password was changed.', {
                        position: toast.POSITION.TOP_CENTER
                    })
                    history.push('/auth/login/')
                }
            })
        // signin(data.email, data.password).then( ( res ) => {
        //     console.log(res);
        //     if (res.name === 'FirebaseError'){
        //         let ErrorText = '';
        //         switch (res.code){
        //             case 'auth/too-many-requests':
        //                 ErrorText = 'Too many requests. Please try again later.';
        //                 break;
        //             case 'auth/user-disabled':
        //                 ErrorText = 'Account is disabled.';
        //                 break;
        //             case 'auth/wrong-password':
        //                 ErrorText = 'Incorrect Email or Password'
        //                 break;
        //             case 'auth/user-not-found':
        //                 ErrorText = 'User with this email was not found';
        //                 break;
        //         }
        //         toast.error(ErrorText, {
        //             position: toast.POSITION.TOP_CENTER
        //         });
        //     }
        //
        // });
    };
    return (
        <Container fluid={true}>
            <div className="auth">
                <div className="auth_container">
                    <div className="auth_content reset shadow-lg shadow-showcase">
                        {status === false ? <AlertCircle color='#dc3545' size='64' /> :
                            <Form className="theme-form" onSubmit={handleSubmit(onSubmit)}>
                                <h4>{"Reset Password"}</h4>
                                <p>{email}</p>

                                <FormGroup className={errors.password && 'is-invalid'}>
                                    <Label className="col-form-label">{Password}</Label>
                                    <Input {...register('password')} type='password'
                                           className={errors.password && 'is-invalid'}/>
                                </FormGroup>
                                <FormGroup className={errors.confirmPassword && 'is-invalid'}>
                                    <Label className="col-form-label">{ConfirmPassword}</Label>
                                    <Input {...register('confirmPassword')} type="password"
                                           className={errors.confirmPassword && 'is-invalid'}/>
                                </FormGroup>
                                <Button color="primary" className="btn-block">{"Confirm reset"}</Button>
                            </Form>
                        }
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default ResetPassword;