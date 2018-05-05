import * as React from 'react';
import { Menu, Container, Image, Icon } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';

class Navbar extends React.Component<any, any> {

    handleClick(event: any) {
        this.props.history.push("/");
    }

    render() {
        const logo = require('../img/logo.png');
        return (
            <Menu
                inverted={true}
                size="large"
            >
                <Container>
                    <Menu.Item as="a" onClick={(event) => this.handleClick(event)}>
                        <Image src={logo} size="mini"/>
                    </Menu.Item>
                    <Menu.Item
                        as={Link}
                        to="/about"
                        id="navbarItemAbout"
                        style={{color: 'white'}}
                    >
                        About
                    </Menu.Item>
                    <Menu.Item
                        as={Link}
                        to="/contact"
                        style={{color: 'white'}}
                    >
                        Contact
                    </Menu.Item>
                    <Menu.Item
                        as="a"
                        href="https://github.com/dubious-developments/UnSHACLed"
                        target="_blank"
                        icon={
                            <Icon
                                name="github"
                                inverted={true}
                            />

                        }
                    />
                    <Menu.Item
                        as="a"
                        href="https://github.com/dubious-developments/UnSHACLed/wiki/Release-notes"
                        target="_blank"
                    >
                        v0.5
                    </Menu.Item>
                </Container>
            </Menu>
        );
    }
}
export default withRouter(Navbar);