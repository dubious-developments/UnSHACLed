import * as React from 'react';
import { Form, Button, Grid, Image, Header, Segment, Input, Divider } from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import Auth from '../services/Auth';

class LoginForm extends React.Component<any, any> {

    constructor(props: string) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    render() {
        const logo = require('../img/logo.svg');
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
                                        onChange={(event, newValue) => this.setState({username: newValue})}
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
                                        onChange={(event, newValue) => this.setState({password: newValue})}
                                    />
                                </Form.Field>

                                <Button
                                    color="teal"
                                    fluid={true}
                                    inverted={true}
                                    size="large"
                                    onClick={(event) => this.handleClick(event)}
                                > Login
                                </Button>

                                <Divider
                                    horizontal={true}
                                    inverted={true}
                                >Or
                                </Divider>
                                <Button
                                    animated="fade"
                                    fluid={true}
                                    inverted={true}
                                    size="large"
                                >
                                    <Button.Content visible={true}>
                                    Sign-up
                                    </Button.Content>
                                    <Button.Content hidden={true}>
                                        Coming soon!
                                    </Button.Content>
                                </Button>

                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        )
            ;
    }

    handleClick(event: any) {
        Auth.login();
        if (this.state.username === "" || this.state.password === "") {
            console.log("invalid");
        } else {
            this.props.history.push("/user");
        }
    }
}
export default withRouter(LoginForm);
