export function updateName(name: any) {
    return{
        type: 'updateUsername',
        payload: {
            name
        }
    };
}

export function updateLogin(login: any) {
    return{
        type: 'updateUserLogin',
        payload: {
            login
        }
    };
}

export function updateEmail(email: any) {
    return{
        type: 'updateUserEmail',
        payload: {
            email
        }
    };
}

export function updateToken(token: any) {
    return{
        type: 'updateUserToken',
        payload: {
            token
        }
    };
}