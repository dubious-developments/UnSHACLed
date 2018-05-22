import * as React from 'react';
import {Header, Image} from 'semantic-ui-react';

/**
 * Component containing the fifth section of the user manual.
 */
class Section5 extends React.Component<any, any> {

    imgMargin = {
        marginTop: '1em',
        marginBottom: '1em'
    };

    /** Render component **/
    render() {

        const s51 = require('../../img/user_manual/s5_1.png');
        const s52 = require('../../img/user_manual/s5_2.png');
        const s53 = require('../../img/user_manual/s5_3.png');
        const s54 = require('../../img/user_manual/s5_4.png');
        const s56 = require('../../img/user_manual/s5_6.png');
        const s57 = require('../../img/user_manual/s5_7.png');
        const s58 = require('../../img/user_manual/s5_8.png');
        const s59 = require('../../img/user_manual/s5_9.png');
        const s510 = require('../../img/user_manual/s5_10.png');
        const s511 = require('../../img/user_manual/s5_11.png');
        const s512 = require('../../img/user_manual/s5_12.png');
        const s513 = require('../../img/user_manual/s5_13.png');
        const s514 = require('../../img/user_manual/s5_14.png');
        const s515 = require('../../img/user_manual/s5_15.png');
        const s516 = require('../../img/user_manual/s5_16.png');
        const s517 = require('../../img/user_manual/s5_17.png');
        const s518 = require('../../img/user_manual/s5_18.png');
        const s519 = require('../../img/user_manual/s5_19.png');
        const s520 = require('../../img/user_manual/s5_20.png');
        const s521 = require('../../img/user_manual/s5_21.png');
        const s522 = require('../../img/user_manual/s5_22.png');
        const s523 = require('../../img/user_manual/s5_23.png');
        return (
            <div style={{marginTop: '2em'}}>
                <Header as="h1" id="5"> Extra </Header>
                <p> The following section contains all functionality that does not fit into the editing part of our
                    editor. In this section, you will find a detailed description on several topics ranging from
                    adapting the editors view, displaying additional information sources as well as some support
                    features.
                </p>
                <Header as='h2' color="teal" id="5.1"> View </Header>
                <p> The following section contains a description on how to change the view on the graph.
                    Changing the view
                    includes zooming, zooming out, panning and fitting the graph to the screen. These functions
                    aide in keeping an overview of the graph as a whole.
                </p>
                {/** Zooming in and out **/}
                <Header as='h3' color="teal"> Zooming in and out </Header>
                <p> The following will guide you through the process of <b> zooming in or out </b> on
                    your graph.
                </p>
                <p> To zoom in or out on the graph via the edit buttons, simply click
                    the zoom icons in the toolbar on top of the screen. These icon are highlighted in red
                    in the figure below. When these icon are clicked, the editor will zoom in or out on the graph canvas
                    depending on which function was chosen.
                </p>
                <Image src={s52} centered={true} style={this.imgMargin}/>
                <p> The second option to execute the zoom functions is via the top toolbar containing the
                    dropdowns. This time click the 'View' dropdown as indicated below: </p>
                <Image src={s51} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s53} centered={true} style={this.imgMargin}/>
                <p> From the dropdown menu, you can now choose either to zoom in or zoom out.
                    Again, the editor will perform the same actions as described above. Besides this second option
                    a third option is also available. Zooming in can also be done using the keyboard
                    shortcut '+' or 'Alt+Scroll' while zooming out is done by using the '-' or 'Alt+Scroll'
                    keyboard keys.
                    These keyboard shortcuts are also visible in the figure above.
                </p>
                {/** Panning **/}
                <Header as='h3' color="teal"> Panning </Header>
                <p> The following will guide you through the process of <b> panning </b>
                    your graph to different directions
                </p>
                <p> To pan the graph to the left, position your mouse pointer into the graph canvas and
                    scroll the mouse wheel backwards while holding 'SHIFT'. To pan the graph to the right, follow
                    the same steps except for scrolling the mouse wheel which now requires scrolling forward.
                </p>
                <p> To pan the graph upwards, position your mouse pointer into the graph canvas and
                    scroll the mouse wheel backwards. To pan the graph downwards, follow
                    the same steps except for scrolling the mouse wheel which now requires scrolling forward.
                </p>
                {/** Fit graph to screen **/}
                <Header as='h3' color="teal"> Fit graph to screen </Header>
                <p> The following will guide you through the process of <b> fitting the graph </b>
                    onto your screen.
                </p>
                <p> To fit the graph to your screens via the edit buttons, simply click
                    the fit icon in the toolbar on top of the screen. This icon is highlighted in red
                    in the figure below. When tis icon is clicked, the editor will make the graph fit the screen
                    and position it in the top-left corner.
                </p>
                <Image src={s54} centered={true} style={this.imgMargin}/>
                <p> The second option to make the graph fit the screen, is via the top toolbar containing the
                    drop downs. This time click the 'View' drop down as indicated below: </p>
                <Image src={s51} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s53} centered={true} style={this.imgMargin}/>
                <p> From the drop down menu, you can now choose 'Fit to screen' option.
                    Again, the editor will perform the same actions as described above.
                    The effect of fitting the graph to your screen is illustrated below:
                </p>
                <Image src={s56} centered={true} style={this.imgMargin} size="big"/>

                {/** Collapse sidebar **/}
                <Header as='h3' color="teal"> Collapse sidebar </Header>
                <p> The following will guide you through the process of <b> collapsing the sidebar </b>
                </p>
                <p> The sidebar can be shown or hidden. Both options are done by simply clicking the
                    collapse icon in the toolbar on top of the screen. The icon is highlighted in the figure below.
                    If the sidebar is shown, a click will hide the sidebar and vice versa.
                </p>
                <Image src={s523} centered={true} style={this.imgMargin}/>

                <Header as='h2' color="teal" id="5.2"> Info Sources </Header>
                <p> The following section includes a detailed description on how to enable
                    additional information sources ranging from editing to account info.
                </p>
                {/** User info **/}
                <Header as='h3' color="teal"> User info </Header>
                <p> The following will guide you through the process of <b> acquiring user info </b>
                    of the authenticated user.
                </p>
                <p> To get information on the authenticated user, click the drop down menu in the toolbar on top
                    of the screen. This is located in the top-right corner of the screen and should look like this:
                </p>
                <Image src={s57} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following: </p>
                <Image src={s59} centered={true} style={this.imgMargin}/>
                <p> Next, click the 'My profile' option. The editor will open a pop-up screen
                    which contains detailed information on the authenticated user. You can close this
                    pop-up by clicking the close icon, or clicking anywhere around it. An example of
                    how such a user profile pop-up should look like is given below.
                </p>
                <Image src={s510} centered={true} style={this.imgMargin} size="big"/>
                {/** Release notes **/}
                <Header as='h3' color="teal"> Release notes </Header>
                <p> The following will guide you through the process of <b> acquiring the release notes of
                    UnSHACLed</b>
                </p>
                <p> To read the notes on the latest release of UnSHACLed, click the version number in toolbar
                    on top of the screen. This is located in top-right corner and is illustrated below.
                </p>
                <Image src={s58} centered={true} style={this.imgMargin}/>
                <p> This will open a new tab where you are redirected to the GitHub page containing
                    the latest release notes.
                </p>
                {/** Show prefixes **/}
                <Header as='h3' color="teal"> Show prefixes </Header>
                <p> The following will guide you through the process of <b> displaying the prefixes of graph
                    components</b>
                </p>
                <p>
                    To make sure the graph overview is clear to read, all prefixes are left out in the graph
                    components. If you still want to see the original prefixes, click the drop down menu in the sidebar
                    as seen in the figure below.
                </p>
                <Image src={s511} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following: </p>
                <Image src={s512} centered={true} style={this.imgMargin}/>
                <p> Next, click the 'Prefixes' option. The sidebar will now switch its content
                    to the prefixes. This is illustrated in the figure below.
                </p>
                <Image src={s513} centered={true} style={this.imgMargin}/>
                {/** Show legend **/}
                <Header as='h3' color="teal"> Show legend </Header>
                <p> The following will guide you through the process of <b> displaying the legend of graph
                    components</b>
                </p>
                <p>
                    The legend contains information and color coding for each graph component. If you want to discover
                    the meaning of each individual graph component, you can display the legend by following the
                    next steps. To display the legend, check the check box at the bottom of the sidebar. An unchecked
                    legend should look like this:
                </p>
                <Image src={s514} centered={true} style={this.imgMargin}/>
                <p> After checking the check box, the legend should be displayed as seen in the figure below. To
                    hide the legend again, simply uncheck the check box again.
                </p>
                <Image src={s515} centered={true} style={this.imgMargin}/>
                {/** Get snapshot of graph **/}
                <Header as='h3' color="teal"> Get snapshot of graph </Header>
                <p> The following will guide you through the process of <b>generating a snapshot
                    of the current graph </b>
                </p>
                <p> To generate of snapshot of the graph via the edit buttons, simply click
                    the camera icon in the toolbar on top of the screen. This icon is highlighted in red
                    in the figure below. When this icon is clicked, the editor will generate a snapshot
                    in a newly opened tab in your browser.
                </p>
                <Image src={s516} centered={true} style={this.imgMargin}/>
                <p> The second option to generate a snapshot, is via the top toolbar containing the
                    drop downs. This time click the 'View' dropdown as indicated below: </p>
                <Image src={s51} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s53} centered={true} style={this.imgMargin}/>
                <p> From the drop down menu, you can now choose the 'Print Graph' option.
                    Again the editor will perform the same actions as described above. The result
                    of a generated snapshot can be seen in the figure below:
                </p>
                <Image src={s517} centered={true} style={this.imgMargin} size="big"/>
                {/** Search for building blocks **/}
                <Header as='h3' color="teal"> Search for building blocks </Header>
                <p> The following will guide you through the process of <b> filtering building blocks
                </b> for drag-and-dropping graph components.
                </p>
                <p>
                    To filter the building block based on a search string, the sidebar provided
                    a search field. An empty search field will generate all available building
                    blocks in the system. The search field is located as seen below:
                </p>
                <Image src={s518} centered={true} style={this.imgMargin}/>
                <p> The result of a user filtering building block by providing a search string is given below: </p>
                <Image src={s519} centered={true} style={this.imgMargin}/>

                <Header as='h2' color="teal" id="5.3"> Support </Header>
                <p> The following section includes a detailed description on how to acquire
                    support while using the editor.
                </p>

                {/** Consult user manual */}
                <Header as='h3' color="teal"> Consult user manual </Header>
                <p> The following will guide you through the process of <b> consulting the user manual
                </b> through the editor.
                </p>
                <p> Consulting the user manual is done via the top toolbar containing the
                    drop downs. This time click the 'Help' dropdown as indicated below: </p>
                <Image src={s520} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s521} centered={true} style={this.imgMargin}/>
                <p> From the drop down menu, you can now choose the 'User manual' option.
                    The editor will redirect you to the page containing the online user manual.
                </p>
                {/** UnSHACLed Cheat Sheet */}
                <Header as='h3' color="teal"> UnSHACLed Cheat Sheet </Header>
                <p> The following will guide you through the process of <b> consulting the keyboard shortcuts
                </b> through the editor.
                </p>
                <p> Consulting the keyboard shortcuts is done via the top toolbar containing the
                    drop downs. This time click the 'Help' drop down as indicated below: </p>
                <Image src={s520} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s521} centered={true} style={this.imgMargin}/>
                <p> From the drop down menu, you can now choose the 'Keyboard shortcuts' option.
                    The editor will display a pop-up screen containing the UnSHACLed cheat
                    sheet as illustrated below:
                </p>
                <Image src={s522} centered={true} style={this.imgMargin} size="big"/>
            </div>
        );
    }
}

export default Section5;
