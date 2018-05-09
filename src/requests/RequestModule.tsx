import axios from 'axios';

/*
 RequestModule class which serves several http requests functions for interaction
 with bot the collaboration server as well as the GitHub API to other components
 of the application.
 */
class RequestModule {
    /* Collaboration Server interaction */

    /*
        Method to receive a token from the collaboration server.
        A POST request is used to obtain the token in a plain text from the collaboration server.
        The obtained token is used for further authentication.
     */
    static getToken() {
        axios.post('http://193.190.127.184:8042/auth/request-token')
            .then(response => {
                console.log(response);
            });

        console.log("GETTING TOKEN");
        console.log("POST http://193.190.127.184:8042/auth/request-token");
    }

    /* Method to start authentication process through the collaboration server using
    a GET request with the earlier obtained token. The collaboration server will redirect
    to the GitHub login page and redirect if logged in succesfully.
     */
    static AuthWithToken(token: any) {
        console.log("ask for authentication");
        window.open('http://193.190.127.184:8042/auth/auth/' + token, "_blank",
            "top=100,left=500,width=500,height=1000");
        console.log('http://193.190.127.184:8042/auth/auth/' + token);
    }

    /* Method to check wether or not a user with an obtained token is authenticated using a
       GET request to the collaboration server including the previously obtained token
        Returns either true or false
     */
    static isAuthenticated(token: any) {
        axios.get('http://193.190.127.184:8042/auth/is-authenticated/', token)
            .then(response => {
                console.log(response);
            });
        console.log("check if authenticated ");
        console.log('http://193.190.127.184:8042/auth/is-authenticated/' + token);
        return true;
    }

    /* GitHub API*/
    static getUserInfo(user: any) {

    }

    static getUserRepos(user: any) {

    }
}

export default RequestModule;