import * as React from 'react';
import {Header, List, Image} from 'semantic-ui-react';

class Section4 extends React.Component<any, any> {

    imgMargin = {
        marginTop: '1em',
        marginBottom: '1em'
    };

    render() {
        // const s41 = require('../../img/user_manual/s4_1.png');
        const s42 = require('../../img/user_manual/s4_2.png');
        const s43 = require('../../img/user_manual/s4_3.png');
        const s44 = require('../../img/user_manual/s4_4.png');
        return (
            <div style={{marginTop: '2em'}}>
                <Header as="h1"> Editing </Header>
                <p> Editing is the core of UnSHACLed, hence the following sections contain a detailed description
                    on how to edit using UnSHACLed. Besides the built in functionality of our editor, the in-graph
                    editing is also included and discussed in detail. Reading through this section as a whole
                    should give you a good grasp of the core concept of UnSHACLed. </p>
                <List>
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

                {/** Editor functionality **/}
                <Header as="h2"> Editor Functionality </Header>
                <p> The following section contains information on the built in functionality that allows
                    easy-to-use icons and functions to perform actions on the current graph. Each edit function
                    is discussed individually and all options to perform that function are provided. </p>
                <Header as='h3' color="teal"> Undo and redo actions </Header>
                <p> The following will guide you through the process of <b> undoing and redoing actions </b> on
                    your graph.
                </p>
                <p> To undo or redo the last action performed on the graph via the edit buttons, simply click
                    the undo or redo icons in the toolbar on top of the screen. These icon are highlighted in red
                    in the figure below. When these icon are clicked, the editor will revert to a previous state
                    of the graph or convert to a future state depending on which function was chosen.
                </p>
                <Image src={s44} centered={true} style={this.imgMargin}/>
                <p> The second option to execute the undo or redo funcion is via the top toolbar containing the
                dropdowns. This time click the 'Edit' dropdown as indicated below </p>
                <Image src={s42} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s43} centered={true} style={this.imgMargin}/>
                <p> From the dropdown menu, you can now choose either the undo function or the redo function.
                Again the editor will perform the same actions as described above. Besides this second option
                a third option is also available. The undo function can be used by performing the keyboard
                shortcuts 'CTRL+Z' while the redo function is done by using the 'CTRL+Y' keyboard keys.
                The keyboard shortcuts are also visible in the figure above.
                </p>
            </div>
        );
    }
}

export default Section4;
