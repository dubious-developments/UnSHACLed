import * as React from 'react';
import {Segment} from 'semantic-ui-react';
import Navbar from '../components/navbarHome';
import HomeCon from '../components/containerHome';

/**
 * Component containing the content of the home page.
 */
class Home extends React.Component {
    /** Render component **/
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
                    <HomeCon/>
                </Segment>
            </div>
        );
    }
}

export default Home;
