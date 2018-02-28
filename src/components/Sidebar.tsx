import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Add from 'material-ui/svg-icons/content/add';

const Sidebar = () => (
    <div>
        <List>
            <Subheader>SHACL</Subheader>
            <ListItem primaryText="Shape" rightIcon={<Add />}/>
            <ListItem primaryText="Node Shape" rightIcon={<Add />} />
            <ListItem primaryText="Property Shape" rightIcon={<Add />} />
        </List>
        <Divider />
        <List>
            <Subheader>General</Subheader>
            <ListItem primaryText="Arrow" rightIcon={<Add />}/>
            <ListItem primaryText="Rectangle" rightIcon={<Add />} />
        </List>
        <Divider />
        <List>
            <Subheader>Template</Subheader>
            <ListItem primaryText="Building" rightIcon={<Add />}/>
            <ListItem primaryText="Person" rightIcon={<Add />} />
        </List>
    </div>
);

export default Sidebar;