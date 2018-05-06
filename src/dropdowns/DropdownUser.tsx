import * as React from 'react';
import {Dropdown} from 'semantic-ui-react';

/*
    Component used to create a dropdown component for an authenticated user

 */
class DropdownUser extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Dropdown text='Username' pointing="top right">
                <Dropdown.Menu>
                    <Dropdown.Item text='Signed in as user'/>
                    <Dropdown.Item text='My Profile'/>
                    <Dropdown.Item text='My Projects'/>
                    <Dropdown.Item text='Sign out'/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default DropdownUser;