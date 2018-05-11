import axios from 'axios';

/**
 * RequestModule class which serves several http requests functions for interaction
 * with bot the collaboration server as well as the GitHub API to other components
 * of the application.
 */

class RequestModule {

    /**
     * Method to receive a token from the collaboration server.
     * A POST request is used to obtain the token in a plain text from the collaboration server.
     * The obtained token is used for further authenticatio
     * @returns {Promise<AxiosResponse<any>>}, Return the obtained token through a promise.
     */
    static getToken() {
        return axios.post('http://193.190.127.184:8042/auth/request-token')
            .then(res => res.data);
    }

    /**
     * Method to start authentication process through the collaboration server using
     * a GET request with the earlier obtained token. The collaboration server will redirect
     * to the GitHub login page and redirect if logged in succesfully
     * @param token: token associated with authenticated user and obtained using getToken().
     */
    static AuthWithToken(token: any) {
        window.open('http://193.190.127.184:8042/auth/auth/' + token, "_blank",
            "top=100,left=500,width=500,height=1000");
    }

    /**
     * Method to check wether or not a user with an obtained token is authenticated using a
     * GET request to the collaboration server including the previously obtained token
     * @param token: token associated with authenticated user and obtained using getToken().
     * @returns {Promise<AxiosResponse<any>>}, Returns either true or false through a promise.
     */
    static isAuthenticated(token: any) {
        return axios.get('http://193.190.127.184:8042/auth/is-authenticated/' + token)
            .then(res => res.data);
    }

    /**
     * Method to obtain user info for an authenticated user
     * @param type: specifies type of user info, can be 'login', 'name' or 'email'.
     * @param token: token associated with authenticated user and obtained using getToken().
     * @returns {Promise<AxiosResponse<any>>}, Returns the requested user info through a promise.
     */
    static getUserInfo(type: any, token: any) {
        console.log('http://193.190.127.184:8042/user/' + type + '/' + token);
        return axios.get('http://193.190.127.184:8042/user/' + type + '/' + token)
            .then(res => res.data);
    }

    /**
     * Method to obatin user object from GitHub API
     * @param login: login from authenticated user
     * @returns {Promise<AxiosResponse<any>>}, return user object through a promise.
     */
    static getUerObject(login: any) {
        return axios.get('https://api.github.com/users/testfv')
            .then(res => res.data);
    }

    /**
     * Method to grab a list of a user's repositories
     * @param token: token associated with authenticated user and obtained using getToken().
     * @returns {Promise<AxiosResponse<any>>}, return list of repo through a promise.
     */
    static getUserRepos(token: any) {
        console.log('http://193.190.127.184:8042/user/repo-list/' + token);
        return axios.get('http://193.190.127.184:8042/user/repo-list/' + token)
            .then(res => res.data);
    }
}

export default RequestModule;