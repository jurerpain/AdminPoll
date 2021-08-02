import {ADD_USER_DATA, USER_AUTH} from "../actionTypes";

export const setAuth = (Auth) => {
  return { type: USER_AUTH, payload: Auth };
};

export const setUserData = (data) =>{
  return {type: ADD_USER_DATA, payload: data};
};
