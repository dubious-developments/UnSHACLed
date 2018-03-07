import * as React from 'react';
import LoginForm from '../form/LoginForm';
import { Segment } from 'semantic-ui-react';
import Navbar from '../components/navbarHome';

class Login extends React.Component<any, any> {

    render() {
        return (
            <div className="loginPage">

                <Segment
                    inverted={true}
                    textAlign="center"
                    style={{ minHeight: 835}}
                    vertical={true}
                >
                    <Navbar/>
                    <LoginForm history={this.props.history}/>
                </Segment>
            </div>
        )
            ;
    }
}
export default Login;
