import * as React from 'react';
import { Segment, Container, Image, Header, Grid, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Home extends React.Component {

    render() {
        const logo = require('../img/shacl_logo_trans.png');
        return (
            <div className="homePage">
                <Segment
                    inverted={true}
                    textAlign="center"
                    style={{ minHeight: 835}}
                    vertical={true}
                >
                    {/*
                     Navigation Bar
                     */}

                    {/*
                     Main Container
                     */}
                    <Container text={true}>

                        <Image
                            src={logo}
                            size="tiny"
                            verticalAlign="middle"
                            style={{
                                marginTop: '2em'
                            }}
                        />

                        <Header
                            as="h1"
                            inverted={true}
                            style={{
                                fontSize: '3em',
                                fontWeight: 'normal',
                                marginTop: '2em',
                            }}
                        >
                            {' '} UnSHACLed
                        </Header>

                        <Header
                            as="h2"
                            content="A visual IDE for Semantic Web constraint languages"
                            inverted={true}
                            style={{
                                fontSize: '1.5em',
                                fontWeight: 'normal',
                                marginTop: '1.5em',
                            }}
                        />
                        <Grid
                            verticalAlign="middle"
                            textAlign="center"
                            style={{
                                marginTop: '6.5em',
                            }}
                            columns={2}
                            divided={true}

                        >
                            <Grid.Column style={{maxWidth: 250}}>
                                <Button
                                    inverted={true}
                                    color="teal"
                                    size="huge"
                                >
                                    <Link
                                        to="/login"
                                        style={{color: 'white'}}
                                    > Login
                                    </Link>
                                </Button>
                            </Grid.Column>
                            <Grid.Column style={{maxWidth: 250}}>
                                <Button
                                    inverted={true}
                                    size="huge"
                                > Sign Up
                                </Button>
                            </Grid.Column>

                        </Grid>
                    </Container>
                </Segment>
            </div>
        );
    }
}
export default Home;
