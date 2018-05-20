import * as React from 'react';
import {Header, Image} from 'semantic-ui-react';

class Section5 extends React.Component<any, any> {
   
    imgMargin = {
        marginTop: '1em',
        marginBottom: '1em'
    };

    render() {

        const s51 = require('../../img/user_manual/s5_1.png');
        const s52 = require('../../img/user_manual/s5_2.png');
        const s53 = require('../../img/user_manual/s5_3.png');
        const s54 = require('../../img/user_manual/s5_4.png');
        // const s55 = require('../../img/user_manual/s5_5.png');
        const s56 = require('../../img/user_manual/s5_6.png');
        return (
            <div>
                <Header as="h1"> Extra </Header>
                <p> The following section contain all functionality that does not fit into the editing part of our
                    editor. In this section, you will find a detailed description on several topics ranging from
                    adapting the editors view, displaying additional informations sources as well as some support
                    features.
                </p>
                <Header as='h2' color="teal"> View </Header>
                <p> The following section contains how to change the view on the graph. Changing the view
                    includes zooming, zooming out, panning and fitting graph to the screen. These functions
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
                    Again the editor will perform the same actions as described above. Besides this second option
                    a third option is also available. Zooming in can also be done using the keyboard
                    shortcut '+'  or 'Alt+Scroll' while zooming out is done by using the '-' or 'Alt+Scroll'
                    keyboard keys.
                    The keyboard shortcuts are also visible in the figure above.
                </p>
                {/** Panning **/}
                <Header as='h3' color="teal"> Panning </Header>
                <p> The following will guide you through the process of <b> panning </b>
                    your graph to the left or right.
                </p>
                <p> To pan the graph to the left, position your mouse pointer into the graph canvas and
                    scroll the mouse wheel backwards while holding 'SHIFT'. To pan the graph to the right, follow
                    the same steps except for scrolling the mouse wheel which now requires scrolling forward.
                </p>
                {/** Fit graph to screen **/}
                <Header as='h3' color="teal"> Fit graph to screen </Header>
                <p> The following will guide you through the process of <b> fitting the graph </b>
                    onto your screen.
                </p>
                <p> To fit the graph to your screens via the edit buttons, simply click
                    the fit icon in the toolbar on top of the screen. These icon are highlighted in red
                    in the figure below. When these icon are clicked, the editor will make the graph fit the screen
                    and position it in the top-left corner.
                </p>
                <Image src={s54} centered={true} style={this.imgMargin}/>
                <p> The second option to execute make the graph fit the screen, is via the top toolbar containing the
                    drop downs. This time click the 'View' drop down as indicated below: </p>
                <Image src={s51} centered={true} style={this.imgMargin}/>
                <p> This will bring up the following:</p>
                <Image src={s53} centered={true} style={this.imgMargin}/>
                <p> From the dropdown menu, you can now choose 'Fit to screen' option.
                    Again the editor will perform the same actions as described above.
                    The effect of the fitting the graph to your screen is illustrated below:
                </p>
                <Image src={s56} centered={true} style={this.imgMargin} size="big"/>
            </div>
        );
    }
}

export default Section5;
