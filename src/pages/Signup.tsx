import * as React from 'react';
import {Segment} from 'semantic-ui-react';
import Navbar from '../components/navbarHome';
import SignupForm from '../form/SignupForm';

class Signup extends React.Component<any, any> {

    render() {
        return (
            <Segment
                inverted={true}
                textAlign="center"
                style={{height: '100vh'}}
                vertical={true}
            >
                <Navbar/>
                <SignupForm/>
            </Segment>
        );
    }
}

export default Signup;
