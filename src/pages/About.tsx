import * as React from 'react';
import { Segment, Container, Header, List} from 'semantic-ui-react';
import Navbar from '../components/navbarHome';

class About extends React.Component<any, any> {

    render() {
        return (
            <div>
                <Segment
                    inverted={true}
                    textAlign="center"
                    style={{height: '100vh'}}
                    vertical={true}
                >
                    <Navbar/>
                    <Container text={true} style={{marginTop: '2em'}} textAlign="left">
                        <Header as='h3' color="teal">Semantic Web?</Header>
                        <p>
                            <small>
                                The Semantic Web is an extension of the current Web expanding it with
                            meaning and allowing machines to reason about information in a human-like way.
                            Despite its good intention, the abundance of unstructured data within the Semantic Web
                            hampers the collaboration between different entities. To overcome this, SHACL
                            allows people to set up constraints for what their data should look like so one can
                            ascertain its exact format and look. Crucially, machines can also check whether data
                            conforms to the constraints, making the contract between collaborating entities
                            verifiable and offering more structure to the Semantic Web.
                        </small>
                        </p>
                    </Container>

                    <Container text={true} style={{marginTop: '2em'}} textAlign="left">
                        <Header as='h3' color="teal">Why UnSHACLed?</Header>
                        <p>
                            <small>
                            Current constraint editors are mostly text-based.
                            The problem with these becomes clear looking at a similar problem: imagine
                            developing UML rules by typing them. You immediately feel that this would
                            be a slow and repetitive process in contrast to creating UML with a design tool.
                            Our product solves a similar issue, but with SHACL instead of UML.

                            Using a visual editor/IDE enables users to easily adopt an unfamiliar technology
                            due to its intuitive visualization which abstracts most of the complexity of the
                            underlying technology. In addition, it increases productivity,
                            allowing for faster development.

                            Our tool also allows for collaborative editing,
                            so SHACL experts and non-experts can easily work together and assist each other.
                            </small>
                        </p>
                    </Container>


                    <Container text={true} style={{marginTop: '2em'}} textAlign="left">
                        <Header as='h3' color="teal">Features</Header>
                        <p>
                            <small>
                            To allow intuitive, fast development of constraints and a clear
                            detection of non-conforming data, our product offers several features:
                            </small>
                        </p>
                        <List bulleted={true}>
                            <List.Item>
                                <small>An innovative way of visualizing data and constraints</small>
                            </List.Item>
                            <List.Item>
                                <small>Intuitive building and editing of your own constraints in a visual manner</small>
                            </List.Item>
                            <List.Item>
                                <small>Pointing out errors clearly, giving users the context
                                    they need to understand why their data is non-conforming.</small>
                            </List.Item>
                            <List.Item>
                                <small>
                                    Creating templates to further enable rapid development
                                    and prevent a repetitive workflow
                                </small>
                            </List.Item>
                            <List.Item>
                                <small>
                                    Working together with others to gain more experience regarding a new technology
                                </small>
                            </List.Item>
                            <List.Item>
                                <small>Save and exchange your constructed formats</small>
                            </List.Item>
                        </List>
                    </Container>

                </Segment>
            </div>
        )
            ;
    }
}
export default About;
