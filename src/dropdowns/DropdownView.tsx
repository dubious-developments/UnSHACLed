import * as React from 'react';
import {Dropdown, Popup} from 'semantic-ui-react';
/*
    Component used to create a dropdown component for the view toolbar option
    Requires several props from the parent, which can be found in interfaces.d.ts

 */
class DropdownView extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Dropdown text='Edit'>
                <Dropdown.Menu>
                    <Dropdown.Item icon='zoom' text='Zoom in'/>
                    <Dropdown.Item icon='zoom' text='Zoom out'/>
                    <Dropdown.Item icon='compress' text='Set actual size'/>
                    <Dropdown.Item icon='expand' text='Fit to screen'/>
                    <Dropdown.Divider/>
                    <Dropdown.Item icon='camera' text='Print Graph'/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default DropdownView;