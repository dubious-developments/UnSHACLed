import * as React from 'react';
import {Dropdown, Header, Icon, Modal, Table} from 'semantic-ui-react';
import {Link} from "react-router-dom";

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
                    <Dropdown.Item>
                            <Link target="_blank" to="/support" style={{color:'black'}}>
                                <Icon name="book"/> User Manual
                            </Link>
                    </Dropdown.Item>
                    <Modal
                        trigger={<Dropdown.Item icon='keyboard' text='Keyboard Shortcuts'/>}
                        closeIcon={true}
                        mountNode={document.getElementById("root")}
                        style={{
                            marginTop: '0 !important',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            position: 'relative',
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}
                    >
                        <Header icon='keyboard' content='Keyboard shortcuts'/>
                        <Modal.Content>
                            <Table celled={true} striped={true}>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell collapsing={true}>
                                            <Icon name='reply'/> Undo last action
                                        </Table.Cell>
                                        <Table.Cell> Ctr + Z</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell collapsing={true}>
                                            <Icon name='share'/> Redo last action
                                        </Table.Cell>
                                        <Table.Cell> Ctr + Y</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell collapsing={true}>
                                            <Icon name='trash'/> Delete selected components from graph
                                        </Table.Cell>
                                        <Table.Cell> Del </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell collapsing={true}>
                                            <Icon name='copy'/> Copy selected components to clipboard
                                        </Table.Cell>
                                        <Table.Cell> Ctr + C</Table.Cell>
                                    </Table.Row>

                                    <Table.Row>
                                        <Table.Cell collapsing={true}>
                                            <Icon name='paste'/> Paste components on clipboard into graph
                                        </Table.Cell>
                                        <Table.Cell> Ctr + V</Table.Cell>
                                    </Table.Row>

                                    <Table.Row>
                                        <Table.Cell collapsing={true}>
                                            <Icon name='block layout'/> Select all graph components
                                        </Table.Cell>
                                        <Table.Cell> Ctr + A</Table.Cell>
                                    </Table.Row>

                                    <Table.Row>
                                        <Table.Cell collapsing={true}>
                                            <Icon name='zoom'/> Zoom in
                                        </Table.Cell>
                                        <Table.Cell> + / Alt + Scroll </Table.Cell>
                                    </Table.Row>

                                    <Table.Row>
                                        <Table.Cell collapsing={true}>
                                            <Icon name='zoom'/> Zoom out
                                        </Table.Cell>
                                        <Table.Cell> - / Alt + Scroll </Table.Cell>
                                    </Table.Row>

                                    <Table.Row>
                                        <Table.Cell collapsing={true}>
                                            <Icon name='move'/> Move whole graph
                                        </Table.Cell>
                                        <Table.Cell> Hold right mouse button </Table.Cell>
                                    </Table.Row>

                                    <Table.Row>
                                        <Table.Cell collapsing={true}>
                                            <Icon name='resize horizontal'/> Pan to the left/right
                                        </Table.Cell>
                                        <Table.Cell> Shift + Scroll </Table.Cell>
                                    </Table.Row>

                                </Table.Body>
                            </Table>
                        </Modal.Content>
                    </Modal>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default DropdownView;