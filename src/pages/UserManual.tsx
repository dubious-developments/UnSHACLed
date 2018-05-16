import * as React from 'react';
import {Header, Menu, Container, Image, List} from 'semantic-ui-react';
import Section1 from './sections/Section1';

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
                    <p><b> Table of Contents </b></p>
                    {/* Table of contents */}
                    <List ordered={true}>
                            <List.Item>
                            <a>Introduction</a>
                            <List.List>
                                <List.Item as='a'>Semantic Web</List.Item>
                                <List.Item as='a'>SHACL</List.Item>
                                <List.Item as='a'>UnSHACLed</List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item as='a'>
                            <a> Getting Started</a>
                            <List.List>
                                <List.Item as='a'>Create an account</List.Item>
                                <List.Item as='a'>Login to UnSHACLed</List.Item>
                                <List.Item as='a'>Logout</List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <a>File Handling</a>
                            <List.List>
                                <List.Item as='a'> Open local files</List.Item>
                                <List.Item as='a'>Save local files</List.Item>
                                <List.Item as='a'>Open files from your account </List.Item>
                                <List.Item as='a'>Save files to your account </List.Item>
                                <List.Item as='a'>Create new projects </List.Item>
                                <List.Item as='a'>Create new files in a project </List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <a>Editor functionality</a>
                            <List.List>
                                <List.Item as='a'>Semantic Web</List.Item>
                                <List.Item as='a'>SHACL</List.Item>
                                <List.Item as='a'>UnSHACLed</List.Item>
                            </List.List>
                        </List.Item>
                    </List>

                    {/* Content */}
                    <Section1/>
                </Container>

            </div>
        );
    }
}

export default Home;
