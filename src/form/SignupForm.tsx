import * as React from 'react';
import {Grid, Header, Image, Container, List, Button} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import Auth from '../services/Auth';
import {Link} from 'react-router-dom';

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
                    style={{height: '100%', marginTop: '2em'}}
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
                        <Container text={true} style={{marginTop: '2em'}} textAlign="left">
                            <Header as="h3" inverted={true}>
                                Set up a GitHub account
                            </Header>
                            <p>
                                You will need a GitHub account in order to collaborate with others and
                                save your constrains or data remotely.
                                If you already have a GitHub account, you can login
                                <Link to="/login"> here </Link>.
                            </p>
                            {/* Steps */}
                            <List
                                ordered={true}
                                inverted={true}
                                relaxed="very"
                                style={{marginTop: '2em', marginBottom: '2em' }}
                            >
                                <List.Item>
                                    Go to the GitHub sign up page by using the button below.
                                </List.Item>
                                <List.Item>
                                    Pick a username, e-mail and password to create an account.
                                </List.Item>
                                <List.Item>
                                    Follow the instructions to complete your GitHub registration.
                                </List.Item>
                                <List.Item>
                                    <Link to="/login"> Login </Link> to UnSHACLed
                                </List.Item>
                            </List>
                        </Container>
                        {/* Button */}
                        <Button
                            color="teal"
                            inverted={true}
                            size="large"
                            icon="github"
                            content="Sign up for GitHub"
                            as="a"
                            href="https://github.com/join"
                            target="_blank"
                        />
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
