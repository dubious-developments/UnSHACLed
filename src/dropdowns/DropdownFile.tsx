import * as React from 'react';
import {Dropdown, Button} from 'semantic-ui-react';
import {DropdownFileProps} from '../components/interfaces/interfaces';

/*
    Component used to create a dropdown component for the file toolbar option
    Requires several props from the parent, which can be found in interfaces.d.ts

 */
class DropdownFile extends React.Component<DropdownFileProps, any> {

    constructor(props: any) {
        super(props);
        this.getOpenedFiles = this.getOpenedFiles.bind(this);
    }

    getOpenedFiles() {
        let items: any[] = [];

        if (this.props.opened_files.length === 0) {
            console.log('no files found in child component');
            items.push(<Button key="none" icon="ban" disabled={true} basic={true} content="No files opened"/>);
        }

        for (let i = 0; i < this.props.opened_files.length; i++) {
            let cur = this.props.opened_files[i];
            items.push(
                <Button
                    key={cur + i}
                    icon="save"
                    basic={true}
                    content={cur}
                    onClick={() => this.props.get_file_from_popup(cur)}
                />
            );
        }

        return (
            <div style={{padding: 0, margin: 0}}>
                <Button.Group vertical={true}>
                    {items}
                </Button.Group>
            </div>
        );
    }

    render() {
        return (
            <Dropdown text='File' pointing="top left">
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

                    <Dropdown
                        text='Save local graph'
                        pointing='left'
                        className='link item'
                        onClick={() => this.props.save_graph(event)}
                    >
                        <Dropdown.Menu content={<this.getOpenedFiles/>}/>
                    </Dropdown>
                    <Dropdown.Divider/>
                    <Dropdown.Item icon='github' text='Open graph from account'/>
                    <Dropdown.Item icon='github' text='Save graph to account'/>
                    <Dropdown.Item icon='trash' text='Clear graph' id='tb_clear_graph'/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default DropdownFile;