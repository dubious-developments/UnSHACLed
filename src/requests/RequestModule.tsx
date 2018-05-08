class RequestModule {
    static getToken() {
        console.log("GETTING TOKEN");
        console.log("POST http://193.190.127.184:8042/auth/request-token");
    }

    static AuthWithToken(token: any) {
        console.log("ask for authentication");
        console.log('http://193.190.127.184:8042/auth/auth/' + token);
    }

    static isAuthenticated(token: any) {
        console.log("check if authenticated ");
        console.log('http://193.190.127.184:8042/auth/is-authenticated/' + token);
        return true;
    }
}

export default RequestModule;