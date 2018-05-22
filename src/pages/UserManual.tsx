import * as React from 'react';
import {Header, Menu, Container, Image, List} from 'semantic-ui-react';
import Section1 from './sections/Section1';
import Section2 from './sections/Section2';
import Section3 from './sections/Section3';
import Section4 from './sections/Section4';
import Section5 from './sections/Section5';
import Section6 from './sections/Section6';
import Section7 from './sections/Section7';
import Section8 from './sections/Section8';
import {HashLink as Link} from 'react-router-hash-link';

/**
 * Component containing the content of the user-manual page.
 */
class Home extends React.Component {
    /** Render component **/
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
                    <List ordered={true} style={{columns: '2', WebkitColumns: '2', MozColumns: '2'}}>
                        <List.Item>
                            <Link to="/support#1">Introduction</Link>
                            <List.List>
                                <List.Item><Link to="/support#1.1">Semantic Web</Link></List.Item>
                                <List.Item><Link to="/support#1.2">SHACL</Link></List.Item>
                                <List.Item><Link to="/support#1.3">UnSHACLed</Link></List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <Link to="/support#2">Getting Started</Link>
                            <List.List>
                                <List.Item><Link to="/support#2.1">Create an account</Link></List.Item>
                                <List.Item><Link to="/support#2.2">Login to UnSHACLed</Link></List.Item>
                                <List.Item><Link to="/support#2.3">Logout</Link></List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <Link to="/support#3">File Handling</Link>
                            <List.List>
                                <List.Item><Link to="/support#3.1"> Open local files</Link></List.Item>
                                <List.Item><Link to="/support#3.2">Save local files</Link></List.Item>
                                <List.Item>
                                    <Link to="/support##3.3">Open files from your account</Link>
                                </List.Item>
                                <List.Item><Link to="/support#3.4">Save files to your account</Link></List.Item>
                                <List.Item><Link to="/support#3.5">Create new projects</Link></List.Item>
                                <List.Item>
                                    <Link to="/support#3.6">Create new files in a project</Link>
                                </List.Item>
                                <List.Item><Link to="/support#3.6">Load and save workspace</Link></List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <Link to="/support#4">Editing</Link>
                            <List.List>
                                <List.Item> <Link to="/support#4.1">Editor functionality</Link></List.Item>
                                <List.Item> <Link to="/support#4.2">In-graph editing</Link></List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <Link to="/support#7">Conformance</Link>
                            <List.List>
                                <List.Item><Link to="/support#7.1">Conformance Workflow</Link></List.Item>
                                <List.Item><Link to="/support#7.2">Visualize conformance</Link></List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <Link to="/support#8">Collaborative editing</Link>
                            <List.List>
                                <List.Item> <Link to="/support#8.1">Collaborative situations</Link></List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <Link to="/support#5">Extra</Link>
                            <List.List>
                                <List.Item><Link to="/support#5.1">View</Link></List.Item>
                                <List.Item><Link to="/support#5.2">Support</Link></List.Item>
                                <List.Item><Link to="/support#5.3">Info</Link></List.Item>
                            </List.List>
                        </List.Item>
                        <List.Item>
                            <Link to="/support#6">Troubleshooting</Link>
                            <List.List>
                                <List.Item> <Link to="/support#6.1">Known Bugs</Link></List.Item>
                                <List.Item> <Link to="/support#6.2">Contact</Link></List.Item>
                            </List.List>
                        </List.Item>
                    </List>

                    {/* Content */}
                    <Section1/>
                    <Section2/>
                    <Section3/>
                    <Section4/>
                    <Section7/>
                    <Section8/>
                    <Section5/>
                    <Section6/>
                </Container>

            </div>
        );
    }
}

export default Home;
