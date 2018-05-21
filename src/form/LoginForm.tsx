import * as React from 'react';
import {Button, Grid, Image, Header, Segment, Divider, Label} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import {Link} from 'react-router-dom';
import RequestModule from '../requests/RequestModule';
import {connect} from 'react-redux';
import {updateEmail, updateLogin, updateName, updateToken, updateAuth} from "../redux/actions/userActions";

/**
 * Component used as the content of the login page.
 */
class LoginForm extends React.Component<any, any> {
    /**
     * Constructor of component
     * @param props
     */
    constructor(props: string) {
        super(props);
        this.state = {
            username: "",
            password: "",
            token: "",
            showLabel: false
        };
        // bind methods to this reference
        this.startEditing = this.startEditing.bind(this);
        this.onUpdateToken = this.onUpdateToken.bind(this);
        this.onUpdateUsername = this.onUpdateUsername.bind(this);
        this.onUpdateEmail = this.onUpdateEmail.bind(this);
        this.onUpdateLogin = this.onUpdateLogin.bind(this);
        this.storeUserInfo = this.storeUserInfo.bind(this);
    }

    /**
     * Lifecycle method invoked when the component mounted.
     * On mounting, the component will request a token from
     * the collaboration server and store in the 'token' state variable
     * @param: none
     * @return: none
     */
    componentDidMount() {
        RequestModule.getToken().then(token => {
            this.setState({
                token: token
            });
        });
    }

    /**
     * Method used to invoke the redux action on the global store (onUpdateToken) through the props.
     * This will result in an updated token variable in the global store.
     * @param token
     * @return none
     */
    onUpdateToken(token: any) {
        this.props.onUpdateToken(token);
    }

    /**
     * Method used to invoke the redux action on the global store (onUpdateName) through the props.
     * This will result in an updated name variable in the global store.
     * @param name
     * @return none
     */
    onUpdateUsername(name: any) {
        if (name) {
            this.props.onUpdateName(name);
        } else {
            this.props.onUpdateName("No name provided.");
        }

    }

    /**
     * Method used to invoke the redux action on the global store (onUpdateLogin) through the props.
     * This will result in an updated login variable in the global store.
     * @param login
     * @return none
     */
    onUpdateLogin(login: any) {
        this.props.onUpdateLogin(login);
    }

    /**
     * Method used to invoke the redux action on the global store (onUpdateEmail) through the props.
     * This will result in an updated email variable in the global store.
     * @param email
     * @return none
     */
    onUpdateEmail(email: any) {
        if (email) {
            this.props.onUpdateEmail(email);
        } else {
            this.props.onUpdateEmail('private e-mail');
        }
    }

    /**
     * Method to handle clicks events based on the state token. Will invoke
     * authentication to the collaboration server.
     * @param event
     */
    handleClick(event: any) {
        let {token} = this.state;
        RequestModule.AuthWithToken(token);
    }

    /**
     * Method invoked when the user successfully authenticated and will proceed to the workspace.
     * Check if the authentication was succesfull.
     * @param event
     */
    startEditing(event: any) {
        let {token} = this.state;
        RequestModule.isAuthenticated(token).then(authenticated => {
            if (authenticated) {
                this.props.onUpdateAuth(true);
                this.props.history.push("/user");
                this.storeUserInfo(token);
            } else {
                console.error('Authentication failed');
                this.setState({
                    showLabel: true
                });
            }
        });
    }

    /**
     * Method that will invoke redux actions to the globar store for storing
     * the authenticated users login, name, email.
     * @param token: authentication token
     */
    storeUserInfo(token: any) {
        this.onUpdateToken(token);
        /* Get Name */
        RequestModule.getUserInfo('name', token).then(username => {
            this.onUpdateUsername(username);
        });
        /* Get login */
        RequestModule.getUserInfo('login', token).then(login => {
            this.onUpdateLogin(login);
        });
        /* Get email */
        RequestModule.getUserInfo('email', token).then(email => {
            this.onUpdateEmail(email);
        });
    }

    /** Render component **/
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
                                fluid={true}
                                inverted={true}
                                size="huge"
                                content="Start editing"
                                onClick={this.startEditing}
                            />
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
}

/**
 * Map global store to props of this component.
 * @param state: state retrieved from the global redux store.
 */
const mapStateToProps = (state) => {
    return state;
};

/**
 * Map redux actions to props of this component. A method call to the props function
 * will automatically dispatch the action through redux without an explicit
 * dispatch call to the global store
 */
const mapActionsToProps = {
    onUpdateToken: updateToken,
    onUpdateName: updateName,
    onUpdateLogin: updateLogin,
    onUpdateEmail: updateEmail,
    onUpdateAuth: updateAuth
};

const ConLoginForm = connect(mapStateToProps, mapActionsToProps)(LoginForm);
export default withRouter(ConLoginForm);
