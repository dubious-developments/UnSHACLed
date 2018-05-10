export function userNameReducer(state: any = '', action: any) {
    switch (action.type) {
        case 'updateUsername':
            return action.payload.name;
        default :
            return state;
    }
}

export function userLoginReducer(state: any = '', action: any) {
    switch (action.type) {
        case 'updateUserLogin':
            return action.payload.login;
        default :
            return state;
    }
}

export function userEmailReducer(state: any = '', action: any) {
    switch (action.type) {
        case 'updateUserEmail':
            return action.payload.email;
        default :
            return state;
    }
}

export function userTokenReducer(state: any = '', action: any) {
    switch (action.type) {
        case 'updateUserToken':
            return action.payload.token;
        default :
            return state;
    }
}