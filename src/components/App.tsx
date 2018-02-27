import * as React from 'react';
import '../style/App.css';
import AppBar from 'material-ui/AppBar';
import Tabs from 'material-ui/Tabs';
import Tab from 'material-ui/Tabs/Tab';

// hotfix for navbar
const styles = {
    appBar: {
        flexWrap: 'wrap',
    },
    tabs: {
        width: '50%',
    },
};

class App extends React.Component {
  render() {
    return (
        <div>
            <AppBar
                title="UnSHACLed"
                style={styles.appBar}
                iconClassNameRight="muidocs-icon-navigation-expand-more"
            >
                <Tabs style={styles.tabs}>
                    <Tab label="import Project"/>
                    <Tab label="save Project"/>
                    <Tab label="import Graph"/>
                    <Tab label="save Graph"/>
                </Tabs>
            </AppBar>

        </div>
    );
  }
}

export default App;
