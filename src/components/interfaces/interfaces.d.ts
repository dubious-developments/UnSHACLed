/*
This file contains all interfaces needed for React Components.
Interfaces should be defined to able to pass props to child components.
How to?
1. Define an interface in this file
2. Import this file in the child component as " import { **choose prop ** } from './interfaces/interfaces'; "
3. Update class header as extends React.Component<**choose prop**, {}>

 */

import PropTypes from 'prop-types';

/* Props defintion for navbar in workspace */

export interface NavbarWorkProps {
    visible: boolean;
    callback: PropTypes.func;
}

/* Props definition for sidebar in workspace */
export interface SidebarProps {
    visible: boolean;
    callback: PropTypes.func;
    templates: any;
    showLabel: any;
}

/* Props definition for mxgraph component */
export interface MxGraphProps {
    callback: PropTypes.func;
    setLabel: PropTypes.func;
}

/* Props definition for ToolbarIcon component */
export interface ToolbarIconProps {
    /* Pop Up */
    p_size: any; // size of the pop-up
    p_position: any; // position of the pop-up
    p_content: any; // content of pop-up
    /* Trigger for the pop-up (always a Menu.Item) */
    t_id: any; // id of the menu item (trigger)
    icon_name: any; // name of the used icon within the menu item (trigger)
}

/* Props definition for SidebarPopup component */
export interface SidebarPopupProps {
    /* Pop Up */
    p_size: any; // size of the pop-up
    p_position: any; // position of the pop-up
    header_title: any; // title of the grid
    trigger: any; // trigger for the pop-op
}