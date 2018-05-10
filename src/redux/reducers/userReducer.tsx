export default function userReducer(state: any = '', action: any) {
    switch (action.type) {
        case 'updateUserAction':
            return action.payload.user;
        default :
            return state;
    }
}