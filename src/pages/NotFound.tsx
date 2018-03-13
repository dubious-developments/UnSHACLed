import * as React from 'react';
import {Segment, Header} from 'semantic-ui-react';
import Navbar from '../components/navbarHome';

class NotFound extends React.Component {

    render() {
        return (
            <div className="homePage">
                <Segment
                    inverted={true}
                    textAlign="center"
                    style={{height: '100vh'}}
                    vertical={true}
                >
                    {/*
                     Navigation Bar
                     */}
                    <Navbar/>
                    {/*
                     Main Container
                     */}
                    <Header
                        as="h1"
                        content="404"
                        color="teal"
                        inverted={true}
                        style={{
                            fontSize: '15em',
                            fontWeight: 'bold',
                            marginTop: '10%',
                        }}
                    />

                    <p 
                        style={{
                            fontSize: '1.5em',
                            marginTop: '1.5em'
                        }}
                    >
                        The linked data you were looking for could not be found.
                    </p>
                </Segment>
            </div>
        );
    }
}
export default NotFound;
