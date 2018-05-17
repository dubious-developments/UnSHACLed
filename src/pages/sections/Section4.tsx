import * as React from 'react';
import {Header, List} from 'semantic-ui-react';

class Section4 extends React.Component<any, any> {

    imgMargin = {
        marginTop: '1em',
        marginBottom: '1em'
    };

    render() {
        // const s41 = require('../../img/user_manual/s4_1.png');
        // const s42 = require('../../img/user_manual/s4_2.png');
        // const s43 = require('../../img/user_manual/s4_3.png');

        return (
            <div style={{marginTop: '2em'}}>
                <Header as="h1"> Editing </Header>
                <List >
                    <List.Item>
                        <a>Editor Functionality</a>
                        <List.List>
                            <List.Item as='a'>Undo and redo action</List.Item>
                            <List.Item as='a'>Delete components</List.Item>
                            <List.Item as='a'>Copy and paste components</List.Item>
                        </List.List>
                    </List.Item>
                    <List.Item>
                        <a>In-graph editing </a>
                        <List.List>
                            <List.Item as='a'>TODO </List.Item>
                        </List.List>
                    </List.Item>
                </List>
            </div>
        );
    }
}

export default Section4;
