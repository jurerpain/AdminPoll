import {ADD_USER_DATA, USER_AUTH} from "../actionTypes";


const initial_state = {
    userAuth: null,
    name: 'Unknown',
    balance: null,
    role: null,
};

export default (state = initial_state, action) => {
    switch (action.type) {

        case USER_AUTH:
            // const authUpdate = action.payload;
            // state.userAuth = authUpdate;
            return {...state, userAuth: action.payload};
        case ADD_USER_DATA:
            const data = action.payload;
            return {...state, ...data};
        default:
            return {...state};
    }
}
