import * as React from 'react';
import { Segment} from 'semantic-ui-react';

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
                   User Manual
                </Segment>
            </div>
        );
    }
}
export default Home;
