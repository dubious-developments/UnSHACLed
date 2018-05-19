import {UPDATE_EMAIL, UPDATE_LOGIN, UPDATE_NAME, UPDATE_TOKEN} from "../actions/userActions";

/**
 * Redux reducers that will be dispatch by an event fired through an action.
 * This reducer will update the 'name' field in the global store by appending replacing the 
 * name it received from the action.
 * @param state: current state of the global store
 * @param action: the dispatched action
 * @return {any} new global state
 */
export function userNameReducer(state: any = '', action: any) {
    switch (action.type) {
        case UPDATE_NAME:
            return action.payload.name;
        default :
            return state;
    }
}

/**
 * Redux reducers that will be dispatch by an event fired through an action.
 * This reducer will update the 'login' field in the global store by appending replacing the
 * login it received from the action.
 * @param state: current state of the global store
 * @param action: the dispatched action
 * @return {any} new global state
 */
export function userLoginReducer(state: any = '', action: any) {
    switch (action.type) {
        case UPDATE_LOGIN:
            return action.payload.login;
        default :
            return state;
    }
}

/**
 * Redux reducers that will be dispatch by an event fired through an action.
 * This reducer will update the 'email' field in the global store by appending replacing the
 * email it received from the action.
 * @param state: current state of the global store
 * @param action: the dispatched action
 * @return {any} new global state
 */
export function userEmailReducer(state: any = '', action: any) {
    switch (action.type) {
        case UPDATE_EMAIL:
            return action.payload.email;
        default :
            return state;
    }
}

/**
 * Redux reducers that will be dispatch by an event fired through an action.
 * This reducer will update the 'token' field in the global store by appending replacing the
 * token it received from the action.
 * @param state: current state of the global store
 * @param action: the dispatched action
 * @return {any} new global state
 */
export function userTokenReducer(state: any = '', action: any) {
    switch (action.type) {
        case UPDATE_TOKEN:
            return action.payload.token;
        default :
            return state;
    }
}