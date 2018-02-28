import * as React from 'react';
import '../style/App.css';
import AppBar from 'material-ui/AppBar';
import Tabs from 'material-ui/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import Slider from './Slider';
import Drawer from 'material-ui/Drawer';
import SideBar from './Sidebar';

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

    constructor(props: string) {
        super(props);
        this.state = {open: true};
    }

/*    handleToggle(): void {
        this.setState(prevState => ({
            open: !prevState.open
        }));
    }*/

  render() {
    return (
        <div>
            <AppBar
                title="UnSHACLed"
                style={styles.appBar}
                iconClassNameRight="muidocs-icon-navigation-expand-more"

            >
                <Drawer
                    width={220}
                    docked={false}
                    open={true}
                >
                    <AppBar/>
                    <SideBar/>
                </Drawer>

                <Tabs style={styles.tabs}>
                    <Tab label="import Project"/>
                    <Tab label="save Project"/>
                    <Tab label="import Graph"/>
                    <Tab label="save Graph"/>
                </Tabs>

            </AppBar>

            <div className="footer">
                <Slider/>
            </div>
        </div>
    );
  }
}

export default App;
