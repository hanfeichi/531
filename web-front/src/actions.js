export const SET_USER = 'SET_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export const setUser = (username) => {
    return {
        type: SET_USER,
        payload: { username }
    };
};
export const logoutUser = () => {
    return {
        type: LOGOUT_USER
    };
};