import * as React from 'react';
import {Segment, Container, Header, List, Icon} from 'semantic-ui-react';
import Navbar from '../components/navbarHome';

/**
 * Component containing the content of the contact page.
 */
class Contact extends React.Component<any, any> {
    /** Render component **/
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
                        <Header as='h3' color="teal"> Contact </Header>
                        <p>
                            <small>
                                For any further questions, please check out our github repository or send us an e-mail!
                            </small>
                        </p>
                        <p>
                            <List size="tiny">
                                <List.Item
                                    as="a"
                                    href="https://github.com/dubious-developments/UnSHACLed"
                                    target="_blank"
                                    icon={
                                        <Icon
                                            name="github"
                                            inverted={true}
                                        />

                                    }
                                    content="Github repository"
                                />
                            </List>
                        </p>
                        <List size="tiny">
                            <List.Item
                                icon='user'
                                content='Baes Jonas (Testing Expert)'
                            />
                            <List.Item
                                icon='mail'
                                content={
                                    <a href='mailto:jonas.baes@ugent.be'>jonas.baes@ugent.be</a>
                                }
                            />
                            <List.Item
                                icon='user'
                                content='De Seranno Alexander  (System Administrator)'
                            />
                            <List.Item
                                icon='mail'
                                content={
                                    <a href='mailto:alexander.deseranno@ugent.be'>alexander.deseranno@ugent.be</a>
                                }
                            />
                            <List.Item
                                icon='user'
                                content='Jocqué Jens (Quality assurance expert)'
                            />
                            <List.Item
                                icon='mail'
                                content={
                                    <a href='mailto:jens.jocque@ugent.be'>jens.jocque@ugent.be</a>
                                }
                            />
                            <List.Item
                                icon='user'
                                content='Langhendries Matthias (Project Manager)'
                            />
                            <List.Item
                                icon='mail'
                                content={
                                    <a href='mailto:matthias.langhendries@ugent.be'>
                                        matthias.langhendries@ugent.be</a>
                                }
                            />
                            <List.Item
                                icon='user'
                                content='Van der Cruysse Jonathan (CI/CD expert)'
                            />
                            <List.Item
                                icon='mail'
                                content={
                                    <a href='mailto:jonathan.vandercruysse@ugent.be'>
                                        jonathan.vandercruysse@ugent.be</a>
                                }
                            />
                            <List.Item
                                icon='user'
                                content='Vanlanduyt Ignace (Secretary)'
                            />
                            <List.Item
                                icon='mail'
                                content={
                                    <a href='mailto:ignace.vanlanduyt@ugent.be'>ignace.vanlanduyt@ugent.be</a>
                                }
                            />
                            <List.Item
                                icon='user'
                                content='Verschelden Freek (Product Owner)'
                            />
                            <List.Item
                                icon='mail'
                                content={
                                    <a href='mailto:freek.verschelden@ugent.be'>freek.verschelden@ugent.be</a>
                                }
                            />
                            <List.Item
                                icon='user'
                                content='Weyns Michael (Quality assurance expert)'
                            />
                            <List.Item
                                icon='mail'
                                content={
                                    <a href='mailto:michael.weyns@ugent.be'>michael.weyns@ugent.be</a>
                                }
                            />
                        </List>
                    </Container>
                </Segment>
            </div>
        )
            ;
    }
}

export default Contact;
