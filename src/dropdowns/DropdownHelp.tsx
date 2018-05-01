import * as React from 'react';
import {Dropdown} from 'semantic-ui-react';
/*
    Component used to create a dropdown component for the Help toolbar option
    Requires several props from the parent, which can be found in interfaces.d.ts

 */
class DropdownView extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Dropdown text='Help' pointing="top left">
                <Dropdown.Menu>
                    <Dropdown.Item icon='idea' text='Start Tutorial'/>
                    <Dropdown.Item icon='play' text='Quick Start video'/>
                    <Dropdown.Item icon='book' text='User Manual'/>
                    <Dropdown.Item icon='keyboard' text='Keyboard Shortcuts'/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default DropdownView;