import { AUTHENTICATE, LOGOUT, SET_USERS, ADD_USER, SET_DID_TRY_AL } from "../actions/auth";

import User from '../../models/user';

const initialState = {
  token: null,
  userId: null,
  didTryAutoLogin: false,
  users: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return {
        users: action.users,
      }

      case ADD_USER:
        const newUser = new User(
          action.userData.id,
          action.userData.email,
          action.userData.firstName,
          action.userData.lastName,
        );
      
        return {
          ...state,
          users: state.users.concat(newUser),
          };
  
  }


  

  switch (action.type) {
   
    case AUTHENTICATE:

      return {
        token: action.token,
        userId: action.userId,
        didTryAutoLogin: true,
      };
      case SET_DID_TRY_AL:
        return {
          ...state,
          didTryAutoLogin: true,
        }
    
    case LOGOUT:
      return {
        ...initialState,
        didTryAutoLogin: true,
      }

    //     case SIGNUP: return {
    //       token: action.token,
    //       userId: action.userId
    //      }

    default:
      return state;
  }
  
};
