import * as React from 'react';
import {Dropdown} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
/*
    Component used to create a dropdown component for an authenticated user

 */
class DropdownUser extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        console.log(this.props);
        return (
            <Dropdown text={this.props.name} pointing="top right">
                <Dropdown.Menu>
                    <Dropdown.Item>
                        Signed in as <b> {this.props.login} </b>
                    </Dropdown.Item>
                    <Dropdown.Item text='My Profile'/>
                    <Dropdown.Item  as={Link} to="/login">
                        Sign out
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

const mapStateToProps = (state) => ({
    name: state.name,
    login: state.login
});

export default connect(mapStateToProps)(DropdownUser);