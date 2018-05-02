import * as React from 'react';
import {Form, Button, Grid, Image, Header, Segment, Input, Divider} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import Auth from '../services/Auth';

class LoginForm extends React.Component<any, any> {

    constructor(props: string) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: ""
        };
    }

    render() {
        const logo = require('../img/logo.png');
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
                            {' '} Join UnSHACLed
                        </Header>
                        <Form size="massive" inverted={true}>
                            <Segment inverted={true}>
                                <Form.Field inline={true}>
                                    <Input
                                        size="large"
                                        required={true}
                                        fluid={true}
                                        label="Username"
                                        labelPosition="left"
                                        onChange={(event, newValue) => this.setState({username: newValue})}
                                        placeholder="Username"
                                    />
                                </Form.Field>
                                <Form.Field inline={true}>
                                    <Input
                                        size="large"
                                        required={true}
                                        fluid={true}
                                        label="Email"
                                        labelPosition="left"
                                        type="email"
                                        onChange={(event, newValue) => this.setState({email: newValue})}
                                        placeholder="example@example.com"
                                    />
                                </Form.Field>
                                <Form.Field inline={true}>
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
                                > Create an account
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
        this.props.history.push("/user");
    }
}

export default withRouter(LoginForm);
