import {useDispatch, useSelector} from "react-redux";
import {ADD_THEME} from "../redux/actionTypes";


export function useCustomizer() {
    const dispatch = useDispatch()
    // const configDB = useSelector(store => store.Customizer.customizer);
    const themeConfig = useSelector(store => store.Customizer.theme);
    const localMode = localStorage.getItem('theme');
    const theme = localMode ? localMode : themeConfig;
    dispatch({type: ADD_THEME, payload: theme})


    // const width = useWindowSize()
    // let history = useHistory();
    document.body.className = `${theme}-only`;
}