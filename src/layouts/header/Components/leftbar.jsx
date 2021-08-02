import React, {Fragment, useEffect, useState} from 'react';
import {Col, Container, Row} from 'reactstrap'
import {
    Airplay,
    GitPullRequest,
    Heart,
    Inbox,
    Layers,
    Sliders,
    User,
    UserCheck,
    UserMinus,
    Users,
    X,
    Zap
} from 'react-feather'
import {Link} from 'react-router-dom'
// import {authPages, comingsoonPages, errorPages, usefullPages} from './pages'
import {
    Authentication,
    BonusUi,
    Bookmark,
    ComingSoon,
    ErrorPage,
    FileManager,
    KanbanBoard,
    LevelMenu,
    MegaMenu,
    SocialApp,
    UsefullPages,
    UserEdit,
    UserProfile,
    UsersCards
} from '../../../constant'
import useWindowSize from "../../../hooks/useWindowSize";

const Leftbar = (props) => {

    const [bonusui, setBonusUI] = useState(false)
    const [levelMenu, setLevelMenu] = useState(false)
    const [sidebartoggle, setSidebartoggle] = useState(true)
    const [megaboxtoggle1, setMegaboxtoggle1] = useState(true)
    const [megaboxtoggle2, setMegaboxtoggle2] = useState(true)
    const [megaboxtoggle3, setMegaboxtoggle3] = useState(true)
    const [megaboxtoggle4, setMegaboxtoggle4] = useState(true)
    const width = useWindowSize()


    useEffect(() => {

        let ignoreClick_On_Out_side_Element = document.getElementById('out_side_click');
        let ignoreClick_On_Main_Nav_Element = document.getElementById('sidebar-menu');
        document.addEventListener('click', function (event) {
            let isClickOutSideElement = ignoreClick_On_Out_side_Element.contains(event.target);
            let isClickMainNavElement = ignoreClick_On_Main_Nav_Element.contains(event.target);
            if (window.innerWidth <= 991 && !isClickOutSideElement && !isClickMainNavElement) {
                //Do something click is outside specified element
                document.querySelector(".page-header").className = "page-header close_icon";
                document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper close_icon "
            }
        });

        if (width <= 767) {
            setMegaboxtoggle1(true)
            setMegaboxtoggle2(true)
            setMegaboxtoggle3(true)
            setMegaboxtoggle4(true)
        } else {
            setMegaboxtoggle1(false)
            setMegaboxtoggle2(false)
            setMegaboxtoggle3(false)
            setMegaboxtoggle4(false)
        }

    }, [width])


    const ToggleBonusUI = (value) => {
        setLevelMenu(false)
        if (value) {
            setBonusUI(!value)
            // document.querySelector(".mega-menu-container").classList.remove("d-block")
        } else {
            setBonusUI(!value)
            if (width <= 991) {
                document.querySelector(".page-header").className = "page-header close_icon";
                document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper close_icon "
                // document.querySelector(".mega-menu-container").classList.add("d-block")
            } else {
                // document.querySelector(".mega-menu-container").classList.add("d-block")
            }
        }
    }

    const responsive_openCloseSidebar = (toggle) => {
        if (width <= 991) {
            setBonusUI(false)
            document.querySelector(".page-header").className = "page-header";
            document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper "
        } else {
            if (toggle) {
                setSidebartoggle(!toggle);
                document.querySelector(".page-header").className = "page-header close_icon";
                document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper close_icon "
                // document.querySelector(".mega-menu-container").classList.remove("d-block")
            } else {
                setSidebartoggle(!toggle);
                document.querySelector(".page-header").className = "page-header";
                document.querySelector(".sidebar-wrapper").className = "sidebar-wrapper "
            }
        }
    };


    const responsiveMegaBox1 = (megabox) => {
        if (width <= 1199) {
            if (megabox) {
                setMegaboxtoggle1(!megabox);
            } else {
                setMegaboxtoggle1(!megabox);
            }
        }
    }
    const responsiveMegaBox2 = (megabox) => {
        if (width <= 1199) {
            if (megabox) {
                setMegaboxtoggle2(!megabox);
            } else {
                setMegaboxtoggle2(!megabox);
            }
        }
    }
    const responsiveMegaBox3 = (megabox) => {
        if (width <= 1199) {
            if (megabox) {
                setMegaboxtoggle3(!megabox);
            } else {
                setMegaboxtoggle3(!megabox);
            }
        }
    }
    const responsiveMegaBox4 = (megabox) => {
        if (width <= 1199) {
            if (megabox) {
                setMegaboxtoggle4(!megabox);
            } else {
                setMegaboxtoggle4(!megabox);
            }
        }
    }

    const OnLevelMenu = (menu) => {
        setBonusUI(false)
        // document.querySelector(".mega-menu-container").classList.remove("d-block")
        setLevelMenu(!menu)
    }

    return (
        <Fragment>
            <div className="header-logo-wrapper" id="out_side_click">
                <div className="logo-wrapper">
                    <Link to={`${process.env.PUBLIC_URL}/dashboard/default`}>
                        <img className="img-fluid for-light" src={require("../../../assets/images/logo/logo.png")} alt=""/>
                        <img className="img-fluid for-dark" src={require("../../../assets/images/logo/logo_dark.png")}
                             alt=""/>
                    </Link>
                </div>
                <div className="toggle-sidebar" onClick={() => responsive_openCloseSidebar(sidebartoggle)}
                     style={window.innerWidth <= 991 ? {display: "block"} : {display: "none"}}>
                    <Sliders className="status_toggle middle sidebar-toggle" id="sidebar-toggle"/>
                </div>
            </div>
            <Col className="left-header horizontal-wrapper pl-0">
            </Col>
        </Fragment>
    );
}

export default Leftbar;