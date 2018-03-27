import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import Auth from "../services/Auth";
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import { NavbarWorkProps } from './interfaces/interfaces';

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
        var input = document.getElementById("importGraph");
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
                    <Menu.Item as="a" onClick={this.iconClick}>
                        <Icon name='content' />
                    </Menu.Item>

                    <Menu.Menu
                        position="right"
                    >
                        <Menu.Item as="a">Import Project</Menu.Item>
                        <Menu.Item as="a">Save Project</Menu.Item>
                        <Menu.Item as="a" onClick={this.uploadFileButton}>
                            Import Graph
                            <input
                                type="file"
                                id="importGraph"
                                style={{"display" : "none"}}
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
                        v0.1
                        </Menu.Item>
                        <Menu.Item as="a" onClick={(event) => this.logoutButton(event)}>
                            <Link to="/login"> Logout </Link>
                        </Menu.Item>
                    </Menu.Menu>

                </Menu>
            </div>
        );
    }
}
export default Navbar;