import * as React from 'react';
import { Segment} from 'semantic-ui-react';
import Navbar from '../components/navbarHome';
import HomeCon from '../components/containerHome';

class Home extends React.Component {

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
