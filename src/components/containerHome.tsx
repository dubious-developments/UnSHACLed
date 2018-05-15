import * as React from 'react';
import {Container, Image, Header, Grid, Button} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

class HomeContainer extends React.Component {

    render() {
        const logo = require('../img/logo.png');
        return (
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
                > {' '} UnSHACLed
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
                        <Link
                            to="/login"
                            style={{color: 'white'}}
                        >
                            <Button
                                id="homeLoginButton"
                                inverted={true}
                                color="teal"
                                size="huge"
                            >
                                Login
                            </Button>
                        </Link>
                    </Grid.Column>
                    <Grid.Column style={{maxWidth: 250}}>
                        <Link
                            to="/signup"
                            style={{color: 'white'}}
                        >
                            <Button
                                id="homeSignUpButton"
                                animated="fade"
                                inverted={true}
                                size="huge"
                            >
                                <Button.Content visible={true}>
                                    Sign-up
                                </Button.Content>
                            </Button>
                        </Link>
                    </Grid.Column>

                </Grid>
            </Container>
        );
    }
}

export default HomeContainer;
