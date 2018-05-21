import * as React from 'react';
import {Menu, Icon, Popup} from 'semantic-ui-react';
import {ToolbarIconProps} from './interfaces/interfaces';

/**
 Component used to create toolbar icon items
 Requires several props from the parent, which can be found in interfaces.d.ts

 **/
class ToolbarIcon extends React.Component<ToolbarIconProps, any> {

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
            <Popup
                trigger={<Menu.Item as="a" id={this.props.t_id} content={<Icon name={this.props.icon_name}/>}/>}
                content={this.props.p_content}
                size={this.props.p_size}
                position={this.props.p_position}
                inverted={true}
            />
        );
    }
}

export default ToolbarIcon;