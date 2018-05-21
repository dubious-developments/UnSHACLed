import * as React from 'react';
import {Segment} from 'semantic-ui-react';
import Navbar from '../components/navbarHome';
import SignupForm from '../form/SignupForm';

/**
 * Component containing the content of the sign-up page.
 */
class Signup extends React.Component<any, any> {
    /** Render component **/
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
