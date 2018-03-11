import * as React from 'react';
import { Sidebar, Menu, Image, Input } from 'semantic-ui-react';

class SideBar extends React.Component<any, any> {

    static SHACLMenuItems = ["Shape", "Node Shape", "Property Shape"];
    static GeneralMenuItems = ["Arrow", "Rectangle"];
    static TemplateMenuItems = ["Building", "Person"];

    constructor(props: string) {
        super(props);

        this.state = {
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.getMenuItemsFiltered = this.getMenuItemsFiltered.bind(this);
        this.DynamicMenu = this.DynamicMenu.bind(this);
    }

    getMenuItemsFiltered(kind: string, query: string) {
        // determine kind of submenu
        var collection;
        if (kind === "SHACL") {
            collection = SideBar.SHACLMenuItems;
        } else if (kind === "General") {
            collection = SideBar.GeneralMenuItems;
        } else if (kind === "Template") {
            collection = SideBar.TemplateMenuItems;
        } else {
            console.log("error unknow kind of submenu");
        }

        // filter if necessary
        if (query === "") {
            return collection;
        } else {
            return collection.filter(value => {
                return value.toLowerCase().indexOf(query.toLocaleLowerCase()) !== -1;
            });
        }
    }

    /*
     * Used for dynamically building the components in the sidebar
     * In the props must specify the menu type
     */
    DynamicMenu(props: any) {
        var kind = props.kind;
        var query = this.state.value;
        var items = [];
        var res = this.getMenuItemsFiltered(kind, query);

        for (var i = 0; i < res.length; i++) {
            var key = kind + i;
            items.push(<Menu.Item as="a" content={res[i]} key={key}/>);
        }

        return (
            <Menu.Menu>
                {items}
            </Menu.Menu>
        );
    }

    handleChange(event: any) {
        this.setState({
           value: event.target.value
        });
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
                    <Menu.Item style={{height: '5em'}}>
                        <Image src={logo} size="mini" centered={true}/>
                    </Menu.Item>

                    <Menu.Item>
                        <Input
                            onChange={this.handleChange}
                            type="text"
                            value={this.state.value}
                            placeholder="Search"
                            inverted={true}
                            icon="search"
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