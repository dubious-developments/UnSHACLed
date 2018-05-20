import * as React from 'react';
import {Header} from 'semantic-ui-react';

class Section7 extends React.Component<any, any> {

    render() {
        return (
            <div style={{marginTop: '2em'}}>
                <Header as="h1"> Conformance </Header>
                <p> As UnSHACLed supports the constraint languages
                    SHACL as a proof of concept, conformance of data against constraints
                is the second core concept of the application. In the following section a detailed
                description is provided on how conformance works and how conformance
                is visualized to the end-user</p>
                {/** Visualize conformance**/}
                <Header as="h2"> Visualize conformance </Header>
                <p> The following contains a description on how the conformance is visualized
                in the graph and how an end-user can interpret possible conformance errors. </p>
            </div>
        );
    }
}

export default Section7;
