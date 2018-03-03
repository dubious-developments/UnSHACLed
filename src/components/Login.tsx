import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { withRouter } from 'react-router-dom';
import Auth from "../Auth";

class Login extends React.Component<any, any> {

    constructor(props: string) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    render() {
        return(
            <div>
                <label>Log in page</label>
                <TextField
                    hintText="Username: "
                    floatingLabelText="Username"
                    onChange={(event, newValue) => this.setState({username:newValue})}
                />
                <br/>
                <TextField
                    type="password"
                    hintText="Password: "
                    floatingLabelText="Password"
                    onChange={(event, newValue) => this.setState({password:newValue})}
                />
                <br/>
                <RaisedButton label="Log in" primary={true} onClick={(event) => this.handleClick(event)} />
            </div>
        );
    }

    handleClick(event: any) {
        Auth.login();
        this.props.history.push("/");
    }
}

export default withRouter(Login);