import * as React from 'react';
import { Popup, Grid, Header, Divider, Image} from 'semantic-ui-react';
import {SidebarPopupProps} from './interfaces/interfaces';

/*
    Component used to create pop-up for draggable elements within the sidebar
    Requires several props from the parent, which can be found in interfaces.d.ts

 */
class SidebarPopup extends React.Component<SidebarPopupProps, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Popup
                trigger={this.props.trigger}
                hoverable={true}
                size={this.props.p_size}
                position={this.props.p_position}
                inverted={true}
            >
                <Grid centered={true} divided={true}>
                    <Grid.Column textAlign='center'>
                        <Header as='h4'> {this.props.header_title} </Header>
                        <Divider/>
                        <Image
                            src={"placeholder"}
                            size="mini"
                            centered={true}
                        />
                    </Grid.Column>
                </Grid>
            </Popup>
        );
    }
}

export default SidebarPopup;