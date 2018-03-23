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

export interface SidebarProps {
    visible: boolean;
}