import * as React from 'react';
import {Dropdown, Popup} from 'semantic-ui-react';
/*
    Component used to create a dropdown component for the edit toolbar option
    Requires several props from the parent, which can be found in interfaces.d.ts

 */
class DropdownEdit extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Dropdown text='Edit' pointing="top left">
                <Dropdown.Menu>
                    <Dropdown.Item icon='reply' text='Undo'/>
                    <Dropdown.Item icon='share' text='Redo'/>
                    <Dropdown.Item icon='trash' text='Delete'/>
                    <Dropdown.Item icon='clipboard' text='Copy'/>
                    <Dropdown.Item icon='paste' text='Paster'/>
                    <Dropdown.Divider/>
                    <Dropdown.Item icon='move' text='Select All' />
                    <Dropdown.Item icon='move' text='Select None' />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default DropdownEdit;