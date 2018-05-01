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
                    <Dropdown.Item icon='reply' text='Undo' id="tb_undo"/>
                    <Dropdown.Item icon='share' text='Redo' id="tb_redo"/>
                    <Dropdown.Item icon='trash' text='Delete' id="tb_delete"/>
                    <Dropdown.Item icon='clipboard' text='Copy' id="tb_copy"/>
                    <Dropdown.Item icon='paste' text='Paste' id="tb_paste"/>
                    <Dropdown.Divider/>
                    <Dropdown.Item icon='move' text='Select All' id="tb_all"/>
                    <Dropdown.Item icon='move' text='Select None' id="tb_none"/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default DropdownEdit;