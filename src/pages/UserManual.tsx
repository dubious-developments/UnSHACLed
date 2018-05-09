import * as React from 'react';
import {Header, Menu, Container, Image} from 'semantic-ui-react';

class Home extends React.Component {

    render() {
        const logo = require('../img/logo.png');
        return (
            <div>
                <Menu fixed='top' inverted={true}>
                    <Container>
                        <Menu.Item header={true}>
                            <Image
                                size='mini'
                                src={logo}
                                style={{marginRight: '1.5em'}}
                            />
                            Unshacled: User Manual
                        </Menu.Item>
                    </Container>
                </Menu>
                <Container text={true} style={{marginTop: '7em'}}>
                    <Header as='h1'> UnSHACLed Online User Manual</Header>
                    <p>A visual IDE for Semantic Web constraint languages </p>
                </Container>

            </div>
        );
    }
}

export default Home;
