import * as React from 'react';
import {Header, Image, List} from 'semantic-ui-react';

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
        const s46 = require('../../img/user_manual/s4_6.png');
        const s47 = require('../../img/user_manual/s4_7.png');
        const s48 = require('../../img/user_manual/s4_8.png');
        const s49 = require('../../img/user_manual/s4_9.png');
        const s410 = require('../../img/user_manual/s4_10.png');
        const s411 = require('../../img/user_manual/s4_11.png');
        const s412 = require('../../img/user_manual/s4_12.png');
        const s413 = require('../../img/user_manual/s4_13.png');
        const s414 = require('../../img/user_manual/s4_14.png');
        const s415 = require('../../img/user_manual/s4_15.png');
        return (
            <div style={{marginTop: '2em'}}>
                <Header as="h1" id='4'> Editing </Header>
                <p> Editing is the core of UnSHACLed, hence the following sections contain a detailed description
                    on how to edit using UnSHACLed. Besides the built in functionality of our editor, the in-graph
                    editing is also included and discussed. Reading through this section as a whole
                    should give you a good grasp on the core concept of UnSHACLed. </p>

                {/** Editor functionality **/}
                <Header as="h2" id='4.1'> Editor Functionality </Header>
                <p> The following section contains information on the built-in functionality that allows
                    to perform actions on the current graph through
                    easy-to-use icons and functions. Each edit function
                    is discussed individually and all options to perform that function are provided. </p>
                {/** Undo and redo actions **/}
                <Header as='h3' color="teal"> Undo and redo actions </Header>
                <p> The following will guide you through the process of <b> undoing and redoing actions </b> on
                    your graph.
                </p>
                <p> To undo or redo the last action performed on the graph via the edit buttons, simply click
                    the undo or redo icons in the toolbar on top of the screen. These icons are highlighted in red
                    in the figure below. When these icon are clicked, the editor will revert to a previous state
                    of the graph or convert to a future state depending on which function you choose.
                </p>
                <Image src={s44} centered={true} style={this.imgMargin}/>
                <p> The second option to execute the undo or redo function is via the top toolbar containing the
                    drop downs. This time click the 'Edit' drop down as indicated below. </p>
                <Image src={s42} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s43} centered={true} style={this.imgMargin}/>
                <p> From the drop down menu, you can now choose either the undo function or the redo function.
                    Again, the editor will perform the same actions as described above. Besides this second option,
                    a third option is also available. The undo function can be used by performing the keyboard
                    shortcuts 'CTRL+Z' while the redo function is done by using the 'CTRL+Y' keyboard keys.
                    These keyboard shortcuts are also visible in the figure above.
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
                <p> The second option to execute the delete function is via the top toolbar containing the
                    drop downs. This time click the 'Edit' drop down as indicated below </p>
                <Image src={s42} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s43} centered={true} style={this.imgMargin}/>
                <p> From the drop down menu, you can now choose the delete function.
                    Again, the editor will perform the same actions as described above. Besides this second option
                    a third option is also available. The delete function on selected components
                    can be used by performing the keyboard shortcuts 'delete' or 'Del'.
                    These keyboard shortcuts are also visible in the figure above.
                </p>
                {/** Copy and paste components **/}
                <Header as='h3' color="teal"> Copy and paste components </Header>
                <p> The following will guide you through the process of <b> copying and pasting selected components
                </b> from and into your graph.
                </p>
                <p>
                    The first option to copy or paste components is through the top toolbar containing the drop downs.
                    To copy or paste components, simply select the desired components in your graph first.
                    This can either be one single component or multiple components
                    (which can be selected holding down the CTRL key). When the components are all selected,
                    click the 'Edit' drop down as indicated below.
                </p>
                <Image src={s42} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s43} centered={true} style={this.imgMargin}/>
                <p> From the drop down menu, you can now choose the copy or paste function.
                    On click, the editor will copy or paste the selected components from or into your graph.
                    Besides this option
                    a second option is also available. The copy function on selected components
                    can be used by performing the keyboard shortcuts 'CTRL+C' while the paste function
                    can be used by 'CTRL+V'. These keyboard shortcuts are also visible in the figure above.
                </p>
                {/** Clear graph**/}
                <Header as='h3' color="teal"> Clear graph </Header>
                <p> The following will guide you through the process of <b> clearing the graph in its entirety
                </b>.
                </p>
                <p>
                    The first option to clear the graph is through the top toolbar containing the drop downs.
                    To clear the graph, click the 'Edit' drop down as indicated below.
                </p>
                <Image src={s42} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s43} centered={true} style={this.imgMargin}/>
                <p> From the drop down menu, you can now choose the clear graph.
                    On click, the editor will clear the entire state of the current graph. <b> Please be careful
                        when using this function.</b> To clear the graph using keyboard shortcuts, press
                    'CTRL+A' to select all components followed by 'delete' to remove all of them.
                </p>
                {/** Select all or select none **/}
                <Header as='h3' color="teal"> Select all or select none </Header>
                <p> The following will guide you through the process of <b> selecting all or selecting none
                </b> of the components in your graph.
                </p>
                <p>
                    The first option to select all or none of the components
                    is through the top toolbar containing the drop downs.
                    To do so, click the 'Edit' drop down as indicated below.
                </p>
                <Image src={s42} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s43} centered={true} style={this.imgMargin}/>
                <p> From the drop down menu, you can now choose the select all or select none function.
                    On click, the editor will select all or select none of the components residing in your graph.
                    These functions can come in handy when combined with other functionality requiring
                    selection of components. Besides this option,
                    a second option is also available. The select all function
                    can be used by performing the keyboard shortcuts 'CTRL+A', no shortcuts are available for
                    the select none function. The keyboard shortcuts are also visible in the figure above.
                </p>

                {/** In-graph editing **/}
                <Header as="h2" id='4.2'> In-graph editing</Header>
                <Header as='h3' color="teal"> Drag-n-Drop components </Header>
                <p> The following will guide you through the process of <b> drag-and-dropping components
                </b> into your graph.
                </p>
                <p>
                    A handy feature of the editor is the possibility to drag-and-drop basic building blocks
                    into the graph. This way you are able to quickly set up basic graph constructions. The draggable
                    components are all visible in the sidebar as seen in the figure below.
                </p>
                <Image src={s46} centered={true} style={this.imgMargin}/>
                <p> To drag and drop a component into the graph, simply hover over the component you wish to add.
                    A pop-up will appear with a preview of the component you are about to drop into the graph.
                    An example of how this should like, is given below. When you selected your component of choice,
                    click and hold the left mouse button while dragging your mouse pointer into the graph canvas. On
                    release of your left mouse button, the editor will draw the component on that position in the
                    graph and you successfully dropped a component.
                </p>
                <Image src={s47} centered={true} style={this.imgMargin}/>
                <Header as='h3' color="teal"> Add templates </Header>
                <p>
                    To avoid repetitive workflow and increase the productivity, the editor offers a template
                    functionality. This functionality includes creating templates from selected graph components.
                    These templates then can be used to quickly drag-and-drop a template components into the graph.
                    These template components can be used to quickly construct a graph component similar
                    to another one. Instead of starting from scratch, which can be repetitive at some point, you
                    simply select the component or components you which to add as a template. After doing so, you
                    click the 'Add template from selection' button as seen in the figure below.
                </p>
                <Image src={s49} centered={true} style={this.imgMargin}/>
                <p>
                    On click, the editor will generate a sidebar entry containing the template component. When a single
                    component is selected, the sidebar entry will contain the name of the selected component. When
                    multiple components are selected, the sidebar will generate a 'Multiple components' entry.
                    An example of generated template components can be seen in the figure below.
                </p>
                <Image src={s48} centered={true} style={this.imgMargin}/>
                <Header as='h3' color="teal"> Move Component </Header>
                <p> The following will guide you through the process of <b> moving components
                </b> within your graph.
                </p>
                <p>
                    Moving components can be done in three possible ways:
                </p>
                    <List bulleted={true}>
                        <List.Item> Select a component, click and drag the component to a different location
                            in the graph canvas.
                        </List.Item>
                        <List.Item> Select multiple components by holding CTRL and clicking,
                            click and drag the selected components to a different location in the graph
                            canvas.
                        </List.Item>
                        <List.Item> Click and hold the right mouse button and move the mouse pointer to
                            a different location. This will move the graph as a whole.
                        </List.Item>
                    </List>

                <Header as='h3' color="teal"> Collapse graph components </Header>
                <p> The following will guide you through the process of <b> collapsing components
                </b> within your graph.
                </p>
                <p>
                    To keep a clear overview of the overall graph, an end-user can opt for collapsing
                    certain graph components. To do so, simply click the little minus icon located
                    on the top-left corner within a graph component. The editor will minimize the graph
                    component and hence preserve more canvas space for other components. An example
                    of a collapsed and expanded graph component can be seen in the figure below. The minus icon
                    will turn into a plus icon once collapsed.
                </p>
                <Image src={s410} centered={true} style={this.imgMargin}/>
                <Image src={s411} centered={true} style={this.imgMargin}/>
                <p>
                    To expand the graph component again, click the plus icon to perform the inverse operation.
                </p>
                <Header as='h3' color="teal"> Edit node name/properties </Header>
                <p> The following will guide you through the process of <b> editing the name of graph components
                    or the value of its properties.
                </b>
                </p>
                <p>
                    All fields in a graph component (name and properties) can be edited by double clicking the
                    text in a row. As a result, the value of the row will be editable and you can change the value
                    as you wish. An example of how a editable field looks like, is given below.
                </p>
                <Image src={s412} centered={true} style={this.imgMargin}/>
                <Header as='h3' color="teal"> Add property </Header>
                <p> The following will guide you through the process of <b> adding a property to a graph component
                </b>
                </p>
                <p>
                    To be able to add new properties to a graph component, each component contains a green icon
                    at the bottom. To add a property to a component of your choice, click the green icon button
                    as illustrated in the figure below
                </p>
                <Image src={s413} centered={true} style={this.imgMargin}/>
                <p> After adding a new property, a new row appears in the graph component which now can be
                    edited according to the desired value of the newly added property. An addition of a property
                    to a graph component should look like the following:
                </p>
                <Image src={s414} centered={true} style={this.imgMargin}/>

                <Header as='h3' color="teal"> Delete property </Header>
                <p> The following will guide you through the process of <b> deleting a property to a graph component
                </b>
                </p>
                <p>
                    To delete a property from a graph component, you need to click the specific property first.
                    After selecting the desired property, simply folow the steps as described in the 'Delete component'
                    section. An example of how the deletion of a property should look like is given below:
                </p>
                <Image src={s415} centered={true} style={this.imgMargin} size="big"/>

            </div>
        );
    }
}

export default Section4;
