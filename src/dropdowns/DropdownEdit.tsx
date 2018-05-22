import * as React from 'react';
import {Dropdown} from 'semantic-ui-react';

/**
 Component used to create a dropdown component for the edit toolbar option
 Requires several props from the parent, which can be found in interfaces.d.ts

 **/
class DropdownEdit extends React.Component<any, any> {

    /**
     * Constructor of component
     * @param props
     */
    constructor(props: any) {
        super(props);
    }

    /** Render component **/
    render() {
        return (
            <Dropdown text='Edit' pointing="top left">
                <Dropdown.Menu>
                    <Dropdown.Item icon='reply' text='Undo' id="tb_undo" description="Ctrl+Z"/>
                    <Dropdown.Item icon='share' text='Redo' id="tb_redo" description="Ctrl+Y"/>
                    <Dropdown.Item icon='trash' text='Delete' id="tb_delete" description="Del"/>
                    <Dropdown.Item icon='clipboard' text='Copy' id="tb_copy" description="Ctrl+C"/>
                    <Dropdown.Item icon='paste' text='Paste' id="tb_paste" description="Ctrl+V"/>
                    <Dropdown.Item icon='trash' text='Clear graph' id='tb_clear_graph'/>
                    <Dropdown.Divider/>
                    <Dropdown.Item icon='move' text='Select All' id="tb_all" description="Ctrl+A"/>
                    <Dropdown.Item icon='move' text='Select None' id="tb_none"/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default DropdownEdit;