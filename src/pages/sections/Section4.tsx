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
        const s45 = require('../../img/user_manual/s4_5.png');
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
                            <List.Item as='a'> Clear graph </List.Item>
                            <List.Item as='a'> Select all or select none</List.Item>
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
                {/** Undo and redo actions **/}
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
                {/** Delete components **/}
                <Header as='h3' color="teal"> Delete components </Header>
                <p> The following will guide you through the process of <b> deleting components </b> from
                    your graph.
                </p>
                <p>
                    To delete a component, simply select a component in your graph first. This can either be one
                    single component or multiple components (which can be selected holding down the CTRL key).
                    When the components are all selected, click the delete icon in the toolbar on top of the screen.
                    Hovering over each icon, will display the action it performs. The delete icon is highlighted in
                    the figure below. Clicking this icon, will invoke the editor to remove the selected components
                    from the graph as expected.
                </p>
                <Image src={s45} centered={true} style={this.imgMargin}/>
                <p> The second option to execute the undo or redo funcion is via the top toolbar containing the
                    dropdowns. This time click the 'Edit' dropdown as indicated below </p>
                <Image src={s42} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s43} centered={true} style={this.imgMargin}/>
                <p> From the dropdown menu, you can now choose the delete function.
                    Again the editor will perform the same actions as described above. Besides this second option
                    a third option is also available. The delete function on selected components
                    can be used by performing the keyboard shortcuts 'delete' or 'Del'.
                    The keyboard shortcuts are also visible in the figure above.
                </p>
                {/** Copy and paste components **/}
                <Header as='h3' color="teal"> Copy and paste components </Header>
                <p> The following will guide you through the process of <b> copying and pasting selected components
                </b> from and into your graph.
                </p>
                <p>
                    The first option to copy or paste components is through the top toolbar containing the dropdowns.
                    To copy or paste components, simply select the desired components in your graph first.
                    This can either be one single component or multiple components
                    (which can be selected holding down the CTRL key). When the components are all selected,
                    click the 'Edit' dropdown as indicated below.
                </p>
                <Image src={s42} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s43} centered={true} style={this.imgMargin}/>
                <p> From the dropdown menu, you can now choose the copy or paste function.
                    On click, the editor will copy or paste the selected components from or into your graph.
                    Besides this option
                    a second option is also available. The copy function on selected components
                    can be used by performing the keyboard shortcuts 'CTRL+C' while the paste function
                    can be used by 'CTRL+V'.The keyboard shortcuts are also visible in the figure above.
                </p>
                {/** Clear graph**/}
                <Header as='h3' color="teal"> Clear graph </Header>
                <p> The following will guide you through the process of <b> clearing the graph in its entirety
                </b>.
                </p>
                <p>
                    The first option to clear the graph is through the top toolbar containing the dropdowns.
                    To clear the graph, click the 'Edit' dropdown as indicated below.
                </p>
                <Image src={s42} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s43} centered={true} style={this.imgMargin}/>
                <p> From the dropdown menu, you can now choose the clear graph.
                    On click, the editor will clear the entire state of the current graph. Please be careful
                    when using this function. To clear the graph using keyboard shortcuts, press
                    'CTRL+A' to select all components followed by 'delete' to remove all of them.
                </p>
                {/** Select all or select none **/}
                <Header as='h3' color="teal"> Select all or select none </Header>
                <p> The following will guide you through the process of <b> select all or select none
                </b> of the components in your grapnh.
                </p>
                <p>
                    The first option to select all or none of the components
                    is through the top toolbar containing the dropdowns.
                    To do so, click the 'Edit' dropdown as indicated below.
                </p>
                <Image src={s42} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s43} centered={true} style={this.imgMargin}/>
                <p> From the dropdown menu, you can now choose the select all or select none function.
                    On click, the editor will select all or select none of the components residing in your graph.
                    These function can come in handy when combined with other functionality requiring
                    selection of components. Besides this option,
                    a second option is also available. The select all function
                    can be used by performing the keyboard shortcuts 'CTRL+A', no shortcuts is available for
                    the select none function. The keyboard shortcuts are also visible in the figure above.
                </p>
            </div>
        );
    }
}

export default Section4;
