import * as React from 'react';
import { Menu, Container, Image, Icon } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';

class Navbar extends React.Component<any, any> {

    handleClick(event: any) {
        this.props.history.push("/");
    }

    render() {
        const logo = require('../img/shacl_logo_trans.png');
        return (
            <Menu
                inverted={true}
                size="large"
            >
                <Container>
                    <Menu.Item as="a" onClick={(event) => this.handleClick(event)}>
                        <Image src={logo} size="mini"/>
                    </Menu.Item>
                    <Menu.Item>
                        <Link
                            to="/about"
                            style={{color: 'white'}}
                        > About
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link
                            to="/contact"
                            style={{color: 'white'}}
                        > Contact
                        </Link>
                    </Menu.Item>
                    <Menu.Item
                        as="a"
                        href="https://github.com/dubious-developments/UnSHACLed"
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
                    >
                        v0.1
                    </Menu.Item>
                </Container>
            </Menu>
        );
    }
}
export default withRouter(Navbar);