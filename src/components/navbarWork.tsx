import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';

class Navbar extends React.Component<any, any> {

    render() {

        return (
            <div>
                <Menu
                    inverted={true}
                    size="large"
                    icon={true}
                    style={{
                        height: '4.85em'
                    }}
                >
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