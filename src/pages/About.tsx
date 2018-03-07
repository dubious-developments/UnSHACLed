import * as React from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';
import Navbar from '../components/navbarHome';

class About extends React.Component<any, any> {

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
                        <Header as='h1'  color="teal" >About UnSHACLed</Header>
                        <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lobortis vehicula ante.
                            Proin sapien ante, bibendum eu porttitor nec, elementum cursus diam.
                            Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                            Proin et sollicitudin neque. Nullam at quam eu purus fringilla dictum.
                            In ut elit eu diam accumsan efficitur in id purus.
                            Sed eget urna vel ligula bibendum molestie volutpat non neque.
                            Aliquam tincidunt vel purus quis aliquet.
                            Maecenas ac mi magna.
                        </p>

                    </Container>
                </Segment>
            </div>
        )
            ;
    }
}
export default About;
