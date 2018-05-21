import * as React from 'react';
import { withRouter } from 'react-router-dom';

/** Deprecated login component **/

class Login extends React.Component<any, any> {

    constructor(props: string) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    /** Render component **/
    render() {
        return(
            <div>
                <label>Log in page</label>
            </div>
        );
    }

}

export default withRouter(Login);