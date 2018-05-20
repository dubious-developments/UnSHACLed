import * as React from 'react';
import {Header, Image} from 'semantic-ui-react';

class Section7 extends React.Component<any, any> {

    imgMargin = {
        marginTop: '1em',
        marginBottom: '1em'
    };

    render() {
        const s71 = require('../../img/user_manual/s7_1.png');
        const s72 = require('../../img/user_manual/s7_2.png');
        const s73 = require('../../img/user_manual/s7_3.png');
        const s74 = require('../../img/user_manual/s7_4.png');
        return (
            <div style={{marginTop: '2em'}}>
                <Header as="h1"> Conformance </Header>
                <p> As UnSHACLed supports the constraint languages
                    SHACL as a proof of concept, conformance of data against constraints
                is the second core concept of the application. In the following section a detailed
                description is provided on how conformance works and how conformance
                is visualized to the end-user</p>
                {/** Visualize conformance**/}
                <Header as="h2" color="teal"> Conformance workflow </Header>
                <p>
                    To ensure the end-user is creating valid constraints and valid data conforming to those
                    constraints, the editor performs a conformance check every two seconds. This value has been
                    chosen such that the end-user is not overload with error messages while editing but still is
                    able to notice when something went wrong.
                </p>
                <Header as="h2"  color="teal"> Visualize conformance </Header>
                <p> The following contains a description on how the conformance is visualized
                in the graph and how an end-user can interpret possible conformance errors.</p>
                <p>
                    When there are no conformance errors, every graph component has its original color coding.
                    However, if a constraint violation did appear during editing or on load of a file, the conformance
                    errors are highlighted. The conformance errors can be consulted in two different ways.
                    The first one,
                    which is the most detailed, show the exact violation that had been made. This option is available
                    by clicking the 'Conformance errors' button in toolbar on top of the screen. An example of how this
                    button produces its result in both cases (no conformance error and a conformance error) is shown in
                    the figures below.
                </p>
                <Image src={s71} centered={true} style={this.imgMargin}/>
                <Image src={s72} centered={true} style={this.imgMargin}/>
                <p> The second option for visualizing conformance errors is a direct visualization in the graph itself.
                    When a constraint violation occurred, the data which caused the error is highlighted in red.
                    An example situation can be seen in the figure below:
                </p>
                <Image src={s73} centered={true} style={this.imgMargin}/>
                <p> Here the PersonShape constraints holds a property, indicating that a Person should have
                    a social security number (ssn). Looking at the properties of the social security node (ssn), you
                    can see that the maximum amount of social security numbers equals 1. Bob, which is an instance
                    of a Person, does have two social security numbers and hence violates the ssn constraint. Whenever
                    the end-user edits the Bob data node to a correct format and the conformance interval performed
                    a check, Bob will revert to its original color coding (green).
                </p>
                <Image src={s74} centered={true} style={this.imgMargin}/>
            </div>
        );
    }
}

export default Section7;
