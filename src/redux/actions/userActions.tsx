export const UPDATE_NAME = 'user:updateName';
export const UPDATE_LOGIN = 'user:updateLogin';
export const UPDATE_EMAIL = 'user:updateEmail';
export const UPDATE_TOKEN = 'user:updateToken';
export const UPDATE_AUTH = 'user:updateAuth';

/**
 * Redux action used to be dispatched to the reducers which will update the store.
 * This action will update the name of the authenticated user in the global store.
 * @param name: name of the authenticated user
 * @return {{type: string; payload: {name}}
 */

export function updateName(name: any) {
    return {
        type: UPDATE_NAME,
        payload: {
            name
        }
    };
}

/**
 * Redux action used to be dispatched to the reducers which will update the store.
 * This action will update the login of the authenticated user in the global store.
 * @param login: login of the authenticated user
 * @return {{type: string; payload: {login}}
 */
export function updateLogin(login: any) {
    return {
        type: UPDATE_LOGIN,
        payload: {
            login
        }
    };
}

/**
 * Redux action used to be dispatched to the reducers which will update the store.
 * This action will update the email of the authenticated user in the global store.
 * @param email: email of the authenticated user
 * @return {{type: string; payload: {email}}
 */
export function updateEmail(email: any) {
    return {
        type: UPDATE_EMAIL,
        payload: {
            email
        }
    };
}

/**
 * Redux action used to be dispatched to the reducers which will update the store.
 * This action will update the token of the authenticated user in the global store.
 * @param token: token of the authenticated user
 * @return {{type: string; payload: {token}}
 */
export function updateToken(token: any) {
    return {
        type: UPDATE_TOKEN,
        payload: {
            token
        }
    };
}

/**
 * Redux action used to be dispatched to the reducers which will update the store.
 * This action will update the token of the authenticated user in the global store.
 * @param auth: boolean value of authentication state.
 * @return {{type: string; payload: {auth}}
 */
export function updateAuth(auth: any) {
    return {
        type: UPDATE_AUTH,
        payload: {
            auth
        }
    };
}