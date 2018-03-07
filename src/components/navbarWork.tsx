import * as React from 'react';
import { Menu, Image, Icon } from 'semantic-ui-react';

class Navbar extends React.Component<any, any> {

    render() {
        const logo = require('../img/shacl_logo_trans.png');
        return (
            <div>
                <Menu
                    inverted={true}
                    size="large"
                    icon={true}
                >
                    <Menu.Item>
                        <Icon
                            name="angle double right"
                            size="large"
                        />
                    </Menu.Item>
                    <Menu.Item><Image src={logo} size="mini"/></Menu.Item>
                    <Menu.Menu
                        position="right"
                    >
                        <Menu.Item as="a">Import Project</Menu.Item>
                        <Menu.Item as="a">Save Project</Menu.Item>
                        <Menu.Item as="a">Import Graph</Menu.Item>
                        <Menu.Item as="a">Save Graph</Menu.Item>
                        <Menu.Item>v0.1.1</Menu.Item>
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
                    </Menu.Menu>
                </Menu>
            </div>
        );
    }
}
export default Navbar;