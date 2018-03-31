import * as React from 'react';
import {Menu, Icon} from 'semantic-ui-react';
import Auth from "../services/Auth";
import {Link} from 'react-router-dom';
import {NavbarWorkProps} from './interfaces/interfaces';

class Navbar extends React.Component<NavbarWorkProps, {}> {

    allowedExtensions = ".n3,.ttl,.rdf";

    constructor(props: any) {
        super(props);
        this.iconClick = this.iconClick.bind(this);
    }

    logoutButton(event: any) {
        Auth.logout();
        // this.props.history.push("/login");
    }

    uploadFileButton() {
        let input = document.getElementById("importGraph");
        if (input) {
            input.click();
        } else {
            console.log("Could not find element 'importGraph'");
        }
    }

    iconClick() {
        this.props.callback(!this.props.visible);
    }

    render() {

        return (
            <div>
                <Menu
                    inverted={true}
                    size="large"
                    icon={true}
                    style={{
                        borderRadius: 0,
                    }}
                >
                    {/* Toolbar icons */}
                    <Menu.Item as="a" onClick={this.iconClick} content={<Icon name='content'/>}/>
                    <Menu.Item as="a" id="delete" content={<Icon name='trash'/>}/>
                    <Menu.Item as="a" id="undo" content={<Icon name='reply'/>}/>
                    <Menu.Item as="a" id="redo" content={<Icon name='share'/>}/>
                    <Menu.Item as="a" id="camera" content={<Icon name='camera'/>}/>
                    <Menu.Item as="a" id="zoom in" content={<Icon name='search'  style={{paddingRight: '1em'}}/>}/>
                    <Menu.Item as="a" id="zoom out" content={<Icon name='search' style={{paddingRight: '1em'}}/>} />
                    <Menu.Item as="a" id="actual size" content={<Icon name='compress'/>}/>
                    <Menu.Item as="a" id="fit" content={<Icon name='expand'/>}/>

                    <Menu.Item as="a">Import Project</Menu.Item>
                    <Menu.Item as="a">Save Project</Menu.Item>
                    <Menu.Item as="a" onClick={this.uploadFileButton}>
                        Import Graph
                        <input
                            type="file"
                            id="importGraph"
                            style={{"display": "none"}}
                            accept={this.allowedExtensions}
                        />
                    </Menu.Item>
                    <Menu.Item as="a">Save Graph</Menu.Item>
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
                        target="_blank"
                        href="https://github.com/dubious-developments/UnSHACLed/wiki/Release-notes"
                    >
                        v0.3
                    </Menu.Item>
                    <Menu.Item
                        as={Link}
                        to="/login"
                        onClick={(event) => this.logoutButton(event)}
                    >
                        Logout
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}

export default Navbar;