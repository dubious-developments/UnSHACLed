import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

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
                <RaisedButton label="Submit" primary={true} onClick={(event) => this.handleClick(event)}/>
            </div>
        );
    }

    handleClick(event: any) {
        return;
    }
}

export default Login;