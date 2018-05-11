import * as React from 'react';
import {Button, Grid, Image, Header, Segment, Divider, Label} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import {Link} from 'react-router-dom';
import RequestModule from '../requests/RequestModule';
import {connect} from 'react-redux';
import {updateEmail, updateLogin, updateName, updateToken} from "../redux/actions/userActions";

class LoginForm extends React.Component<any, any> {

    constructor(props: string) {
        super(props);
        this.state = {
            username: "",
            password: "",
            token: "",
            showLabel: false
        };

        this.startEditing = this.startEditing.bind(this);
        this.onUpdateToken = this.onUpdateToken.bind(this);
        this.onUpdateUsername = this.onUpdateUsername.bind(this);
        this.onUpdateEmail = this.onUpdateEmail.bind(this);
        this.onUpdateLogin = this.onUpdateLogin.bind(this);
        this.storeUserInfo = this.storeUserInfo.bind(this);
    }

    componentDidMount() {
        RequestModule.getToken().then(token => {
            console.log("receive token =>" + token);
            this.setState({
                token: token
            });
        });
    }

    onUpdateToken(token: any) {
        this.props.onUpdateToken(token);
    }

    onUpdateUsername(name: any) {
        if (name) {
            this.props.onUpdateName(name);
        } else {
            this.props.onUpdateName("No name provided.");
        }

    }

    onUpdateLogin(login: any) {
        this.props.onUpdateLogin(login);
    }

    onUpdateEmail(email: any) {
        if (email) {
            this.props.onUpdateEmail(email);
        } else {
            this.props.onUpdateEmail('private e-mail');
        }
    }

    render() {
        const logo = require('../img/logo.png');
        console.log(this.props);
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
                            <Button.Group size='huge' fluid={true}>
                                <Button
                                    color="teal"
                                    inverted={true}
                                    size="huge"
                                    onClick={(event) => this.handleClick(event)}
                                    icon="github"
                                    content="Sign in"
                                />
                                <Button.Or/>
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
                            <p> token => {this.props.token} </p>
                            <p> name => {this.props.name} </p>
                            <p> login => {this.props.login} </p>
                            <p> email => {this.props.email} </p>
                            {this.state.showLabel && (
                                <Label color='red' pointing='above'>Please authenticate first</Label>
                            )}
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
        RequestModule.isAuthenticated(token).then(authenticated => {
            if (authenticated) {
                this.props.history.push("/user");
                this.storeUserInfo(token);
            } else {
                console.log('not authenticated');
                this.setState({
                    showLabel: true
                });
            }
        });
    }

    storeUserInfo(token: any) {
        this.onUpdateToken(token);
        /* Get Name */
        RequestModule.getUserInfo('name', token).then(username => {
            console.log(username);
            this.onUpdateUsername(username);
        });
        /* Get login */
        RequestModule.getUserInfo('login', token).then(login => {
            console.log(login);
            this.onUpdateLogin(login);
        });
        /* Get email */
        RequestModule.getUserInfo('email', token).then(email => {
            console.log(email);
            this.onUpdateEmail(email);
        });
    }
}

const mapStateToProps = (state) => {
    return state;
};

const mapActionsToProps = {
    onUpdateToken: updateToken,
    onUpdateName: updateName,
    onUpdateLogin: updateLogin,
    onUpdateEmail: updateEmail
};

const ConLoginForm = connect(mapStateToProps, mapActionsToProps)(LoginForm);
export default withRouter(ConLoginForm);
