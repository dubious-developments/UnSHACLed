import * as React from 'react';
import { Sidebar, Menu, Input, Icon, Image } from 'semantic-ui-react';

class SideBar extends React.Component {

    static SHACLMenuItems = ["Shape", "Node Shape", "Property Shape"];
    static GeneralMenuItems = ["Arrow", "Rectangle"];
    static TemplateMenuItems = ["Building", "Person"];

    static menuMapping = new Map([
        ["SHACL", SideBar.SHACLMenuItems],
        ["General", SideBar.GeneralMenuItems],
        ["Template", SideBar.TemplateMenuItems]]
    );

    constructor(props: string) {
        super(props);
    }

    /*
     * Used for dynamically building the components in the sidebar
     * In the props must specify the menu type
     */
    DynamicMenu(props: any) {
        var type = props.kind;
        var items = [];
        for (var i = 0; i < SideBar.menuMapping.get(type).length; i++) {
            var key = type + i;
            console.log(key);
            items.push(<Menu.Item as="a" content={SideBar.menuMapping.get(type)[i]} key={key}/>);
        }

        return (
            <Menu.Menu>
                {items}
            </Menu.Menu>
        );
    }

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
                >
                    <Menu.Item>
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
                        <this.DynamicMenu kind="SHACL" />
                    </Menu.Item>

                    <Menu.Item>
                        General
                        <this.DynamicMenu kind="General" />
                    </Menu.Item>

                    <Menu.Item>
                        Template
                        <this.DynamicMenu kind="Template" />
                    </Menu.Item>
                </Sidebar>

        );
    }
}
export default SideBar;