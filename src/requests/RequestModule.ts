import axios from 'axios';

/**
 * RequestModule class which serves several http requests functions for interaction
 * with bot the collaboration server as well as the GitHub API to other components
 * of the application.
 * for more info on how to use:
 * https://github.com/dubious-developments/UnSHACLed/wiki/Interacting-with-the-collaboration-server#file-access
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
            .then(res => res.data)
            .catch(error => {
                console.error("getToken refused: " + error.message);
                return error.status;
            });
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
            .then(res => res.data)
            .catch(error => {
                console.error("isAuthenticated refused: " + error.message);
                return error.status;
            });
    }

    /**
     * Method to obtain user info for an authenticated user
     * @param type: specifies type of user info, can be 'login', 'name' or 'email'.
     * @param token: token associated with authenticated user and obtained using getToken().
     * @returns {Promise<AxiosResponse<any>>}, Returns the requested user info through a promise.
     */
    static getUserInfo(type: any, token: any) {
        return axios.get('http://193.190.127.184:8042/user/' + type + '/' + token)
            .then(res => res.data)
            .catch(error => {
                console.error("getUserInfo refused: " + error.message);
                return error.status;
            });
    }

    /**
     * Method to obatin user object from GitHub API
     * @param login: login from authenticated user
     * @returns {Promise<AxiosResponse<any>>}, return user object through a promise.
     */
    static getUserObject(login: any) {
        return axios.get('https://api.github.com/users/' + login)
            .then(res => res.data)
            .catch(error => {
                console.log("getUserObject refused: " + error.message);
                return error.status;
            });
    }

    /**
     * Method to grab a list of a user's repositories
     * @param token: token associated with authenticated user and obtained using getToken().
     * @returns {Promise<AxiosResponse<any>>}, return list of repo through a promise.
     */
    static getUserRepos(token: any) {
        return axios.get('http://193.190.127.184:8042/user/repo-list/' + token)
            .then(res => res.data)
            .catch(error => {
                console.log("getUserRepos refused: " + error.message);
                return error.status;
            });
    }

    /**
     * Method to fetch files from a repository of choice for an authenticated user
     * @param repoOwner: owner of repository where file is located
     * @param repoName: name of repository
     * @param token: token associated with authenticated user and obtained using getToken().
     * @return {Promise<AxiosResponse<any>>}, returns list of files through a Promise
     */
    static getFilesFromRepo(repoOwner: any, repoName: any, token: any) {
        const target =
            'http://193.190.127.184:8042/repo/file-names/' + repoOwner + '/' + repoName + '/' + token;
        return axios.get(target)
            .then(res => res.data)
            .catch(error => {
                console.log("getFilesFromRepo refused: " + error.message);
                return error.status;
            });
    }

    /**
     * Method to read a file from a repository.
     * @param repoOwner: owner of repository where file is located
     * @param repoName: name of repository
     * @param token: token associated with authenticated user and obtained using getToken()
     * @param fileName: name of file to be read
     *  @return {Promise<AxiosResponse<any>>}, returns content of file as text
     */
    static readFile(repoOwner: any, repoName: any, token: any, fileName: any) {
        const target =
            'http://193.190.127.184:8042/repo/file/' + repoOwner + '/' + repoName + '/' + token + '/' + fileName;
        return axios.get(target)
            .then(res => res.data)
            .catch(error => {
                console.log("readFile refused: " + error.message);
                return error.status;
            });
    }

    /**
     * Method to check wether user has a lock on a file.
     * @param repoOwner: owner of repository where file is located
     * @param repoName: name of repository
     * @param token: token associated with authenticated user and obtained using getToken().
     * @param filePath: path of file to be created updated
     * @returns {Promise<AxiosResponse<any>>}, return true if lock has been granted, false otherwise through a Promise.
     */
    static hasLock(repoOwner: any, repoName: any, token: any, filePath: any) {
        const target =
            'http://193.190.127.184:8042/repo/has-lock/' + repoOwner + '/' + repoName + '/' + token + '/' + filePath;
        return axios.get(target)
            .then(res => res.data)
            .catch(error => {
                console.log("hasLock refused: " + error.message);
                return error.status;
            });
    }

    /**
     * Method to request a lock on a file.
     * @param repoOwner: owner of repository where file is located
     * @param repoName: name of repository
     * @param token: token associated with authenticated user and obtained using getToken().
     * @param filePath: path of file to be created updated
     * @returns {Promise<AxiosResponse<any>>}, return true if lock has been granted, false otherwise through a Promise.
     */
    static requestLock(repoOwner: any, repoName: any, token: any, filePath: any) {
        const target = 'http://193.190.127.184:8042/repo/request-lock/'
            + repoOwner + '/' + repoName + '/' + token + '/' + filePath;
        return axios.post(target)
            .then(res => res.data)
            .catch(error => {
                console.log("requestLock refused: " + error.message);
                return error.status;
            });
    }

    /**
     * Method to release a lock on a file.
     * @param repoOwner: owner of repository where file is located
     * @param repoName: name of repository
     * @param token: token associated with authenticated user and obtained using getToken().
     * @param filePath: path of file to be created updated
     * @returns {Promise<AxiosResponse<any>>}, return true if lock has been released, false otherwise through a Promise.
     */
    static releaseLock(repoOwner: any, repoName: any, token: any, filePath: any) {
        const target = 'http://193.190.127.184:8042/repo/relinquish-lock/'
            + repoOwner + '/' + repoName + '/' + token + '/' + filePath;
        return axios.post(target)
            .then(res => res)
            .catch(error => {
                console.log("releaseLock refused: " + error.message);
                return error.status;
            });
    }

    /**
     * Method to update or create a file. Lock on file is required to do so.
     * @param repoOwner: owner of repository where file is located
     * @param repoName: name of repository
     * @param token: token associated with authenticated user and obtained using getToken().
     * @param fileName: name of file to be created updated
     * @param file: file content, incorporated in body of http request
     */
    static updateFile(repoOwner: any, repoName: any, token: any, fileName: any, file: any) {
        console.log(
            'http://193.190.127.184:8042/repo/file/' + repoOwner + '/' + repoName + '/' + token + '/' + fileName);
        const target =
            'http://193.190.127.184:8042/repo/file/' + repoOwner + '/' + repoName + '/' + token + '/' + fileName;
        return axios.put(target, file)
            .then(res => {
                return res;
            })
            .catch(error => {
                console.error('updateFile refused: ' + error.message);
                return error.status;
            });
    }

    /**
     * Method to stay up to date with the latest version of a file
     * To allow for efficient polling, a timestamp can optionally be included as the request body.
     * If the timestamp is omitted, the server acts as if the epoch was provided as a timestamp.
     * @param repoOwner: owner of repository where file is located
     * @param repoName: name of repository
     * @param token: token associated with authenticated user and obtained using getToken().
     * @param filePath: path of filename in directory
     * @return {Promise<AxiosResponse<any>>}, returns following object through a promise:
     * {
              "isModified": true,
              "lastChange": "2018-05-13T09:14:12.1477890-06:00",
              "contents": "Edit for file polling testing purposes"
            }
     * If no changes were made, the reponse will ommit the content field.
     */
    static pollForChanges(repoOwner: any, repoName: any, token: any, filePath: any) {
        const target =
            'http://193.190.127.184:8042/repo/poll-file/' + repoOwner + '/' + repoName + '/' + token + '/' + filePath;
        return axios.get(target)
            .then(res => res.data)
            .catch(error => {
                console.log("pollForChanges refused: " + error.message);
                return error.status;
            });
    }

    /**
     * Method to create a new repo
     * @param repoName: name of repo to be created
     * @param token: token associated with authenticated user and obtained using getToken().
     * @return none
     */
    static createRepo(repoName: any, token: any) {
        const target = 'http://193.190.127.184:8042/repo/create-repo/' + repoName + '/' + token;
        console.log(target);
        axios.post(target)
            .then(res => res.data)
            .catch(error => {
                console.log("createRepo refused: " + error.message);
                return error.status;
            });
    }

    /**
     * Method to set the contents of an authenticated user's workspace.
     * @param token: token associated with authenticated user and obtained using getToken().
     * @param content: the content of the current workspace
     */
    static setWorkspace(token: any, content: any) {
        axios.put('http://193.190.127.184:8042/workspace/' + token, content)
            .then(res => res.data)
            .catch(error => {
                console.log("setWorkspace refused: " + error.message);
                return error.status;
            });

    }

    /**
     * Method to fetch the contents of an authenticated user's workspace.
     * @param token: token associated with authenticated user and obtained using getToken().
     * @returns {Promise<AxiosResponse<any>>}, return the content as a string and through a Promise.
     */
    static fetchWorkspace(token: any) {
        return axios.get('http://193.190.127.184:8042/workspace/' + token)
            .then(res => {
                console.log(res.data);
                return res.data;
            })
            .catch(error => {
                console.log("fetchWorkspace refused: " + error.message);
                return error.status;
            });
    }

    /* Non-API methods */
    /**
     * Method that will map an array of repos required from the API to
     * an array able to be loaded in a Dropdown UI component.
     * @param repoArray
     */
    static processRepos(repoArray: any) {
        let result: any[] = [];
        for (let i in repoArray) {
            result.push(
                {
                    key: repoArray[i].split("/")[1],
                    text: repoArray[i].split("/")[1],
                    value: repoArray[i].split("/")[1],
                    owner: repoArray[i].split("/")[0],
                }
            );
        }
        return result;
    }

    /**
     * Method that will map an array of files required from the API to
     * an array able to be loaded in a Dropdown UI component.
     * @param files: files to be processed
     */
    static processFiles(files: any) {
        let result: any[] = [];
        for (let i in files) {
            result.push({text: files[i], value: files[i]});
        }
        return result;
    }

    /**
     * Gets the owner of a repository
     * @param repoName: name of repository
     * @param: repos: repository list return from processRepos !!!!!
     * @returns {string}, Returns either the name of the repository or '' if none found.
     */
    static getRepoOwnerFromRepo(repoName: string, repos:any): string {
        for (let r of repos) {
            if (r.text === repoName) {
                return r.owner;
            }
        }
        return '';
    }

    /**
     * Gets the repoOwner belonging to the file
     * @param filename: string value.
     * @param files: list of openend files from the redux store!!!!
     * @returns {string}, Returns either the name of the repository or '' if none found.
     */
    static getRepoOwnerFromFile(filename: string, files:any): string {
        for (let file of files) {
            if (file.name === filename) {
                return file.repoOwner;
            }
        }
        return '';
    }
}

export default RequestModule;