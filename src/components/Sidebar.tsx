import * as React from 'react';
import {
    Sidebar, Menu, Image, Input, Button, Label,
    Accordion, Checkbox, Header, Popup, List, Icon, Dropdown
} from 'semantic-ui-react';
import {SidebarProps} from './interfaces/interfaces';
import SidebarPopup from './sidebarPopup';
import Legend from './Legend';
import {PrefixMap} from "../persistence/graph";
import TreeView from './treeView';

class SideBar extends React.Component<SidebarProps, any> {

    static sidebarOptions = [
        {key: 1, text: 'Add Components', value: 1},
        {key: 2, text: 'Prefixes', value: 2},
        {key: 3, text: 'Project structure', value: 3}
    ];
    static SHACLMenuItems = ["Shape", "Node Shape", "Property Shape"];
    static GeneralMenuItems = ["Arrow", "Rectangle"];
    static TemplateMenuItems;

    static prefixes: PrefixMap;

    constructor(props: any) {
        super(props);

        this.state = {
            value: '',
            content: 1,
            dragid: null
        };

        /* bind template menu to props */
        SideBar.TemplateMenuItems = this.props.templates;

        this.handleChange = this.handleChange.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
        this.getMenuItemsFiltered = this.getMenuItemsFiltered.bind(this);
        this.DynamicMenu = this.DynamicMenu.bind(this);
        this.addTemplateEntry = this.addTemplateEntry.bind(this);
        this.PrefixMenu = this.PrefixMenu.bind(this);
    }

    static setPrefixes(prefixes: PrefixMap) {
        SideBar.prefixes = prefixes;
    }

    getMenuItemsFiltered(kind: string, query: string) {
        // determine kind of submenu
        let collection;
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
        let kind = props.kind;
        let query = this.state.value;
        let items = Array<JSX.Element>();
        let res = this.getMenuItemsFiltered(kind, query);

        for (let i = 0; i < res.length; i++) {
            let key = kind + i;
            items.push(
                <SidebarPopup
                    p_size={"mini"}
                    p_position={"right center"}
                    header_title={res[i]}
                    key={key}
                    trigger={
                        <Menu.Item
                            as="a"
                            id={res[i]}
                            content={res[i]}
                        />
                    }
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

    addTemplateEntry(entryName: any) {
        let {templateCount} = this.state;
        this.setState({
            templateCount: this.state.templateCount + 1,
            templates: this.state.templates.concat(
                <Menu.Item
                    as="a"
                    content={entryName + templateCount}
                    key={entryName}
                    id={entryName}
                />
            )
        });
    }

    PrefixMenu(props: any) {
        let items = Array<JSX.Element>();

        if (SideBar.prefixes) {
            Object.keys(SideBar.prefixes).forEach(key => {
                let line = key + ": " + SideBar.prefixes[key];
                items.push(
                    <Menu.Item
                        as="a"
                        id={SideBar.prefixes[key]}
                        content={line}
                        key={key}
                    />
                );
            });
        } else {
            return (
                <Menu.Menu>
                    <Menu.Item
                        as="a"
                        id={"No prefixes"}
                        content={"No prefixes"}
                        key={"No prefixes"}
                    />
                </Menu.Menu>
            );
        }

        return (
            <Menu.Menu>
                {items}
            </Menu.Menu>
        );
    }

    render() {
        const logo = require('../img/logo.png');
        const defaultOption = 1;
        let {templates} = this.props;
        const rootPanels = [
            {title: 'SHACL', content: {content: <this.DynamicMenu kind="SHACL"/>, key: 'content-1'}},
            {title: 'Template', content: {content: templates, key: 'content-2'}},
        ];

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
                {/* Sidebar Logo */}
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

                {this.state.content === defaultOption && (
                    <div>
                        <Menu.Item style={{backgroundColor: "#3d3e3f"}}>
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
                            <Button
                                id={"addTemplate"}
                                inverted={true}

                            > Add template from selection
                            </Button>
                            {this.props.showLabel ?
                                <Label
                                    basic={true}
                                    color='red'
                                    pointing={true}
                                >
                                    Nothing is selected!
                                </Label> : null
                            }
                        </Menu.Item>

                        <Accordion
                            defaultActiveIndex={[0, 2]}
                            inverted={true}
                            exclusive={false}
                            fluid={true}
                            panels={rootPanels}
                        />

                        <Menu.Item style={{bottom: 0, position: 'absolute'}}>
                            <Legend
                                header_title={"Show Legend"}
                                colors={['#135589', '#2A93D5', 'AED9DA', '#A1E44D']}
                                entries={['Shape', 'Property', 'Property Attribute', 'Data']}
                            />
                        </Menu.Item>
                    </div>

                )
                }

                {this.state.content === 2 && (
                    <Menu.Item>
                        <this.PrefixMenu/>
                    </Menu.Item>
                )
                }
                {this.state.content === 3 && (
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