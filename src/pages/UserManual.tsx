import * as React from 'react';
import {Header, Menu, Container, Image, List} from 'semantic-ui-react';
import Section1 from './sections/Section1';
import Section2 from './sections/Section2';
import Section3 from './sections/Section3';
import Section4 from './sections/Section4';
import Section5 from './sections/Section5';
import Section6 from './sections/Section6';

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
                            UnSHACLed: User Manual
                        </Menu.Item>
                    </Container>
                </Menu>
                <Container text={true} style={{marginTop: '7em', marginBottom: '7em'}}>
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
                        <List.Item>
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
                            <a>Editing</a>
                            <List.List>
                                <List.Item as='a'>Editor functionality</List.Item>
                                <List.Item as='a'>In-graph editing</List.Item>
                                <List.Item as='a'>Extra</List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <a>Extra</a>
                            <List.List>
                                <List.Item as='a'>View</List.Item>
                                <List.Item as='a'>Support</List.Item>
                                <List.Item as='a'>Info</List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <a>Troubleshooting</a>
                            <List.List>
                                <List.Item as='a'>Known Bugs</List.Item>
                                <List.Item as='a'>Contact</List.Item>
                            </List.List>
                        </List.Item>
                    </List>
                    {/* Content */}
                    <Section1/>
                    <Section2/>
                    <Section3/>
                    <Section4/>
                    <Section5/>
                    <Section6/>
                </Container>

            </div>
        );
    }
}

export default Home;
