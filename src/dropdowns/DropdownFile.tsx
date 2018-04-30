import * as React from 'react';
import {Dropdown, Popup} from 'semantic-ui-react';
import {DropdownFileProps} from '../components/interfaces/interfaces';
/*
    Component used to create a dropdown component for the file toolbar option
    Requires several props from the parent, which can be found in interfaces.d.ts

 */
class DropdownFile extends React.Component<DropdownFileProps, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Dropdown text='File'>
                <Dropdown.Menu>
                    <Dropdown.Item text='New'/>
                    <Dropdown
                        text='Open local graph'
                        pointing='left'
                        className='link item'
                    >
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => this.props.import_cb("shacl")}> SHACL Graph </Dropdown.Item>
                            <Dropdown.Item onClick={() => this.props.import_cb("data")}> Data Graph</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Popup
                        trigger={<Dropdown.Item text='Save local graph'/>}
                        on="hover"
                        inverted={false}
                        hoverable={true}
                        position="right center"
                        content={this.props.opened_files}
                    />
                    <Dropdown.Divider/>
                    <Dropdown.Item icon='github' text='Open graph from account' />
                    <Dropdown.Item icon='github' text='Save graph to account'/>
                    <Dropdown.Item icon='trash' text='Clear graph'/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default DropdownFile;