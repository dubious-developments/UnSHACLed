import * as React from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';
import Navbar from '../components/navbarHome';

class Contact extends React.Component<any, any> {

    render() {
        return (
            <div className="loginPage">

                <Segment
                    inverted={true}
                    textAlign="center"
                    style={{height: '100vh'}}
                    vertical={true}
                >
                    <Navbar/>
                    <Container text={true} style={{ marginTop: '7em' }}>
                        <Header as='h1'  color="teal" > Contact </Header>
                        <h1> TODO </h1>
                    </Container>
                </Segment>
            </div>
        )
            ;
    }
}
export default Contact;
