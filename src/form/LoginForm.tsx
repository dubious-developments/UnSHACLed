import * as React from 'react';
import {Button, Grid, Image, Header, Segment, Divider} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import {Link} from 'react-router-dom';
import RequestModule from '../requests/RequestModule';
import axios from "axios";

class LoginForm extends React.Component<any, any> {

    constructor(props: string) {
        super(props);
        this.state = {
            username: "",
            password: "",
            token: ""
        };

        this.startEditing = this.startEditing.bind(this);
    }

    componentDidMount() {
        axios.post('http://193.190.127.184:8042/auth/request-token')
            .then(response => {
                console.log(response);
                this.setState({token: response.data});
            });
    }

    render() {
        const logo = require('../img/logo.png');
        return (
            <div className="login">
                <Grid
                    textAlign="center"
                    style={{height: '100%', marginTop: '2em'}}
                    verticalAlign="middle"
                >
                    <Grid.Column style={{maxWidth: 400}}>
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
                        <Segment inverted={true}>
                            <Button.Group size='huge'>
                                <Button
                                    color="teal"
                                    inverted={true}
                                    size="huge"
                                    onClick={(event) => this.handleClick(event)}
                                    icon="github"
                                    content="Sign in"
                                />
                                <Button.Or />
                                <Button
                                    inverted={true}
                                    size="huge"
                                    icon="signup"
                                    content="Sign up"
                                    as={Link}
                                    to="/signup"
                                />
                            </Button.Group>
                            <Divider horizontal={true} inverted={true}>
                                Authenticated?
                            </Divider>

                            <Button
                                icon="birthday"
                                fluid={true}
                                inverted={true}
                                size="huge"
                                content="Start editing"
                                onClick={this.startEditing}
                            />

                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        )
            ;
    }

    handleClick(event: any) {
        let {token} = this.state;
        console.log(token);
        RequestModule.AuthWithToken(token);
    }

    startEditing(event: any) {
        let {token} = this.state;
        console.log(token);
        if (RequestModule.isAuthenticated(token)) {
            this.props.history.push("/user");
        }
    }
}

export default withRouter(LoginForm);
