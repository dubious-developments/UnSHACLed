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
                            <Button
                                color="teal"
                                fluid={true}
                                inverted={true}
                                size="large"
                                onClick={(event) => this.handleClick(event)}
                                icon="github"
                                content="Sign in with GitHub"
                            />
                            <Divider horizontal={true} inverted={true}>
                                Or
                            </Divider>
                            <Link to="/signup">
                                <Button
                                    animated="fade"
                                    fluid={true}
                                    inverted={true}
                                    size="large"
                                    icon="signup"
                                    content="Sign up"
                                />
                            </Link>
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
        if (RequestModule.isAuthenticated(token)) {
            this.props.history.push("/user");
        }
    }
}

export default withRouter(LoginForm);
