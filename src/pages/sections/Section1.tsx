import * as React from 'react';
import {Header, List} from 'semantic-ui-react';

class Section1 extends React.Component<any, any> {

    render() {
        return (
            <div>
                <Header> Introduction </Header>
                <p> Welcome to the user manual of our UnSHACLed product! UnSHACLed is a visual IDE for Semantic Web
                    constraint languages where the current release supports the recently introduced constraint language
                    SHACL. If none of this sounds familiar, don't worry. The following sections should help you
                    understand the goald and meaning of our product and its surrounding topics.
                </p>
                <Header as='h3' color="teal"> Semantic Web </Header>
                <p>
                    The Semantic Web is an extension of the current Web expanding it with
                    meaning and allowing machines to reason about information in a human-like way.
                    Despite its good intention, the abundance of unstructured data within the Semantic Web
                    hampers the collaboration between different entities. To overcome this, SHACL
                    allows people to set up constraints for what their data should look like so one can
                    ascertain its exact format and look. Crucially, machines can also check whether data
                    conforms to the constraints, making the contract between collaborating entities
                    verifiable and offering more structure to the Semantic Web.
                </p>
                <Header as='h3' color="teal"> SHACL </Header>
                Shapes Constraint Language (SHACL) is a constraint language for validating RDF graphs against a set of
                conditions (often called <b> constraints </b>). These conditions are represented in shapes in the form
                of RDF graphs and for that reason are often called <b> shapes graphs </b>. Those shapes graphs are then
                validated against the normal data (which is also represented in a RDF graph an for that reason is
                called a <b> data graph</b>. SHACL allows us to generate an exact format of how our data shoud look like
                and hence improve data exchanging between different entities. For more information on SHACL or RDF you
                can follow the links below.
                <List>
                    <List.Item as='a' to="https://www.w3.org/TR/shacl/">SHACL specification </List.Item>
                    <List.Item as='a' to="https://www.w3.org/RDF/">RDF info</List.Item>
                </List>
                <Header as='h3' color="teal"> UnSHACLed </Header>
                <p> Current constraint editors are mostly text-based. The problem with these becomes clear looking at a
                    similar problem: imagine developing UML rules by typing them. You immediately feel that this would
                    be a slow and repetitive process in contrast to creating UML with a design tool. Our product solves
                    a similar issue, but with SHACL instead of UML.
                    Using a visual editor/IDE enables users to easily adopt an unfamiliar technology due to its
                    intuitive visualization which abstracts most of the complexity of the underlying technology.
                    In addition, it increases productivity, allowing for faster development.
                    Our tool also allows for collaborative editing, so SHACL experts and non-experts can easily work
                    together and assist each other. To allow intuitive, fast development of constraints and a clear
                    detection of non-conforming data, our product offers several features:
                    <List bulleted={true} style={{marginTop: '1em'}}>
                        <List.Item>An innovative way of visualizing data and constraints</List.Item>
                        <List.Item>Intuitive building and editing of your own constraints in a visual manner</List.Item>
                        <List.Item> Pointing out errors clearly, giving users the context
                            they need to understand why their data is non-conforming</List.Item>
                        <List.Item>Creating templates to further enable rapid development
                            and prevent a repetitive workflow</List.Item>
                        <List.Item> Working together with others to gain more experience regarding a new technology
                        </List.Item>
                        <List.Item> Save and exchange your constructed formats</List.Item>
                    </List>
                </p>
            </div>
        );
    }
}

export default Section1;
