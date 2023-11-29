// reducers.js
import { SET_USER, LOGOUT_USER } from './actions.js';

const initialState = {
    username: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                username: action.payload.username
            };
        case LOGOUT_USER:
            return {
                ...state,
                username: null
            };
        default:
            return state;
    }
};

export default userReducer;
