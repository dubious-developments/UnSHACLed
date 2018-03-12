import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import Auth from "../services/Auth";
import { withRouter } from 'react-router-dom';

class Navbar extends React.Component<any, any> {

    allowedExtensions = ".n3,.ttl,.rdf";

    logoutButton(event: any) {
        Auth.logout();
        this.props.history.push("/login");
    }

    uploadFileButton() {
        var input = document.getElementById("importGraph");
        input.click();
    }

    render() {

        return (
            <div>
                <Menu
                    inverted={true}
                    size="large"
                    icon={true}
                    style={{
                        height: '5.6em',
                        borderRadius: 0,
                    }}
                >
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
                        <Menu.Item onClick={(event) => this.logoutButton(event)}> Logout </Menu.Item>
                    </Menu.Menu>

                </Menu>
            </div>
        );
    }
}
export default withRouter(Navbar);