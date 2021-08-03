import React, {Fragment, useEffect, useState} from 'react';
import man from '../../../assets/images/dashboard/profile.jpg'
import {Bell, FileText, LogIn, Mail, User} from 'react-feather';

import {
    Account,
    CheckAllNotification,
    DeliveryComplete,
    DeliveryProcessing,
    Deutsch,
    English,
    Español,
    Français,
    Inbox,
    LogOut,
    Notification,
    Português,
    Taskboard,
    简体中文
} from '../../../constant'

import {useDispatch, useSelector} from "react-redux";
import {useAuth} from "../../../context/auth/authProvider";


const Rightbar = () => {
    const theme = useSelector(store => store.Customizer.theme);
    const [langdropdown, setLangdropdown] = useState(false)
    const [moonlight, setMoonlight] = useState(theme);
    const [selected, setSelected] = useState("en")
    const [notificationDropDown, setNotificationDropDown] = useState(false)
    const {signout} = useAuth();



    const MoonlightToggle = (theme) => {
        if (theme ==='dark') {
            setMoonlight('light')
            document.body.className = "light"
            localStorage.setItem('theme', 'light');
        } else {
            setMoonlight('dark')
            document.body.className = "dark-only"
            localStorage.setItem('theme', 'dark');
        }
    }

    useEffect(() => {

    }, []);


    return (
        <Fragment>
            <div className="nav-right col-8 pull-right right-header p-0">
                <ul className="nav-menus">

                    {/*<Bookmark/>*/}
                    <li>
                        <div className="mode" onClick={() => MoonlightToggle(moonlight)}><i
                            className={`fa ${moonlight === 'light' ? 'fa-lightbulb-o' : 'fa-moon-o'}`}/></div>
                    </li>
                    <li className="profile-nav onhover-dropdown p-0">
                        <div className="media profile-media">
                            <img className="b-r-10" src={man} alt=""/>
                            <div className="media-body"><span>{'Emay Walter'}</span>
                                <p className="mb-0 font-roboto">Admin <i className="middle fa fa-angle-down"/></p>
                            </div>
                        </div>
                        <ul className="profile-dropdown onhover-show-div">

                            <li
                            onClick={()=> signout()}>
                                <LogIn/><span>{LogOut}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </Fragment>

    );
}
export default Rightbar;