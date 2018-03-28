import * as React from 'react';
import {Sidebar, Menu, Image, Input, Dropdown, Button} from 'semantic-ui-react';
import TreeView from './treeView';
import { SidebarProps } from './interfaces/interfaces';

class SideBar extends React.Component<SidebarProps, any> {

    static sidebarOptions = [
        {key: 1, text: 'Add Components', value: 1},
        {key: 2, text: 'Project structure', value: 2}
    ];
    static SHACLMenuItems = ["Shape", "Node Shape", "Property Shape"];
    static GeneralMenuItems = ["Arrow", "Rectangle"];
    static TemplateMenuItems = ["Address", "Person"];

    constructor(props: any) {
        super(props);

        this.state = {
            value: '',
            content: 1,
            dragid: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
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
        var items = new Array<JSX.Element>();
        var res = this.getMenuItemsFiltered(kind, query);

        for (var i = 0; i < res.length; i++) {
            var key = kind + i;
            items.push(
                <Menu.Item
                    as="a"
                    id={res[i]}
                    content={res[i]}
                    key={key}
                />
            );
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

    handleDropDown(event: any, data: any) {
        this.setState({
            content: data.value
        });

    }
    render() {
        const logo = require('../img/shacl_logo_trans.png');
        const defaultOption = 1;
        return (
            <Sidebar
                as={Menu}
                animation='push'
                visible={this.props.visible}
                vertical={true}
                inverted={true}
                borderless={true}
                style={{
                    width: '50h'
                }}
                id="sideBarID"
            >
                <Menu.Item style={{height: '5em'}}>
                    <Image src={logo} size="mini" centered={true}/>
                </Menu.Item>

                <Menu.Item>
                    <Dropdown
                        defaultValue={defaultOption}
                        options={SideBar.sidebarOptions}
                        fluid={true}
                        direction="left"
                        onChange={this.handleDropDown}
                        as="h5"
                        pointing="top right"
                    />
                </Menu.Item>
                {this.state.content === defaultOption ? (
                    <div>
                        <Menu.Item>
                            <Input
                                onChange={this.handleChange}
                                type="text"
                                value={this.state.value}
                                placeholder="Search components . . ."
                                inverted={true}
                                transparent={true}
                                icon="search"
                            />
                        </Menu.Item>

                        <Menu.Item>
                            SHACL
                            <this.DynamicMenu kind="SHACL"/>
                        </Menu.Item>
{/*                        <Menu.Item>
                            General
                            <this.DynamicMenu kind="General"/>
                        </Menu.Item>*/}
                        <Menu.Item>
                            Template
                            <this.DynamicMenu kind="Template"/>
                        </Menu.Item>
                    </div>
                ) : (
                    <Menu.Item>
                        <TreeView/>
                    </Menu.Item>
                )
                }
            </Sidebar>

        );
    }
}

export default SideBar;