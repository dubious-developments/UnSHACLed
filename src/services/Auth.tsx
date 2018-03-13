// dummy authentication
class Auth {

    static loggedIn = false;

    static isLoggedIn() {
        return this.loggedIn;
    }

    static login() {
        this.loggedIn = true;
    }

    static logout() {
        this.loggedIn = false;
    }
}

export default Auth;