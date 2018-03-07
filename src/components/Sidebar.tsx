import * as React from 'react';
import { Sidebar, Menu, Input, Icon, Image } from 'semantic-ui-react';

class SideBar extends React.Component {

    render() {
        const logo = require('../img/shacl_logo_trans.png');
        return (
                <Sidebar
                    as={Menu}
                    animation='uncover'
                    width="thin"
                    visible={true}
                    icon={true}
                    vertical={true}
                    inverted={true}
                    size="huge"
                    inline={true}
                >
                    <Menu.Item
                    >
                        <Image src={logo} size="mini" centered={true}/>
                    </Menu.Item>
                    <Menu.Item>
                        <Input
                            icon={
                                <Icon
                                    name="search"
                                    inverted={true}
                                />}
                            placeholder="Search..."
                            transparent={true}
                        />
                    </Menu.Item>

                    <Menu.Item >
                        SHACL
                        <Menu.Menu>
                            <Menu.Item as="a" content="Shape"/>
                            <Menu.Item as="a" content="Node Shape"/>
                            <Menu.Item as="a" content="Property Shape"/>
                        </Menu.Menu>
                    </Menu.Item>

                    <Menu.Item>
                        General
                        <Menu.Menu>
                            <Menu.Item as="a" content="Arrow"/>
                            <Menu.Item as="a" content="Rectangle"/>
                        </Menu.Menu>
                    </Menu.Item>

                    <Menu.Item>
                        Template
                        <Menu.Menu>
                            <Menu.Item as="a" content="Building"/>
                            <Menu.Item as="a" content="Person"/>
                        </Menu.Menu>
                    </Menu.Item>
                </Sidebar>

        );
    }
}
export default SideBar;