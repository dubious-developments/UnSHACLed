import * as React from 'react';
import { Form, Button, Grid, Image, Header, Segment, Input, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class LoginForm extends React.Component {
    render() {
        const logo = require('../img/shacl_logo_trans.png');
        return (
            <div className="login">
                <Grid
                    textAlign="center"
                    style={{height: '100%', marginTop: '8em'}}
                    verticalAlign="middle"
                >
                    <Grid.Column style={{maxWidth: 550}}>
                        <Header
                            as="h2"
                            inverted={true}
                            textAlign="center"
                            style={{
                                marginBottom: '1.5em'
                            }}
                        >
                            <Image src={logo}/>
                            {' '}Log-in to your account
                        </Header>
                        <Form
                            size="massive"
                            inverted={true}
                        >
                            <Segment
                                inverted={true}
                            >
                                <Form.Field
                                    inline={true}

                                >
                                    <Input
                                        size="large"
                                        required={true}
                                        fluid={true}
                                        label="Username"
                                        labelPosition="left"
                                    />
                                </Form.Field>

                                <Form.Field
                                    inline={true}
                                >
                                    <Input
                                        size="large"
                                        required={true}
                                        fluid={true}
                                        label="Password"
                                        labelPosition="left"
                                        type="password"
                                    />
                                </Form.Field>

                                <Button
                                    color="teal"
                                    fluid={true}
                                    inverted={true}
                                    size="large"
                                > <Link
                                    to="/"
                                    style={{color: 'white'}}
                                > Login
                                </Link>
                                </Button>

                                <Divider
                                    horizontal={true}
                                    inverted={true}
                                >Or
                                </Divider>
                                <Button
                                    fluid={true}
                                    inverted={true}
                                    size="large"
                                >Sign up
                                </Button>

                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        )
            ;
    }
}
export default LoginForm;
