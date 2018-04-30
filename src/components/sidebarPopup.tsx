import * as React from 'react';
import {Popup, Segment, Header, Divider, Image} from 'semantic-ui-react';
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
        let str = "Shape";
        const preview = require('../img/' + str + '.png');
        console.log(preview);
        return (
            <Popup
                trigger={this.props.trigger}
                hoverable={true}
                size={this.props.p_size}
                position={this.props.p_position}
                inverted={true}
                style={{
                    padding:'0'
                }}
            >
                <Segment basic={true} compact={true} textAlign="center">
                    <Header as='h4'> {this.props.header_title} </Header>
                    <Divider/>
                    <Image
                        src={preview}
                        size="tiny"
                        centered={true}
                    />
                </Segment>
            </Popup>
        );
    }
}

export default SidebarPopup;