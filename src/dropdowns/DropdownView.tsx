import * as React from 'react';
import {Dropdown} from 'semantic-ui-react';

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
            <Dropdown text='View' pointing="top left">
                <Dropdown.Menu>
                    <Dropdown.Item icon='zoom' text='Zoom in' id="tb_zoomin" description="+"/>
                    <Dropdown.Item icon='zoom' text='Zoom out' id="tb_zoomout" description="-"/>
                    <Dropdown.Item icon='compress' text='Set actual size' id="tb_actual"/>
                    <Dropdown.Item icon='expand' text='Fit to screen' id="tb_fit"/>
                    <Dropdown.Divider/>
                    <Dropdown.Item icon='camera' text='Print Graph' id="tb_show"/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default DropdownView;