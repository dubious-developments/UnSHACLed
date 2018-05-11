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

/* Props definition for Legend component */
export interface LegendProps {
    header_title: any; // title besides the checkbox
    colors: any; // array of colors representing the color for each legend entry
    entries: any; // array of text entries for the each legend entry
    /* Colors and text at same array index make up one legend entry ! */
}

/* Props definition for DropdownFile component */
export interface DropdownFileProps {
    opened_files: any; // currently opened files
    import_cb: PropTypes.func; // callback function to parent for importing either a shacl or data graph
    save_graph: PropTypes.func; // callback function to parent for saving graph, will call this.saveGraph
    get_file_from_popup: PropTypes.func; // callback function to parent for saving correct file

}

export interface RepoModalProps {
    visible: any; // state variable from parent that will determine visibility
    confirm_cb: PropTypes.func; // callback function  to parent when confirm is clicked
    cancel_cb: PropTypes.func; // callback function to parent when cancel is clicked
}

/**
 * Props definition for user info modal.
 */
export interface UserModalProps {
    visible: any; // state variable from parent that will determine visibility
    login: any; // login of currently authenticated user
    onClose_cb: PropTypes.func; // callback function to parent when modal is closed
}