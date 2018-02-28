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

class App extends React.Component<any, any> {

    constructor(props: string) {
        super(props);
        this.state = {open: false};
        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle(): void {
        this.setState(prevState => ({
            open: !prevState.open
        }));
    }

  render() {
    return (
        <div>
            <AppBar
                title="UnSHACLed"
                style={styles.appBar}
                iconClassNameRight="muidocs-icon-navigation-expand-more"
                onLeftIconButtonClick={this.handleToggle}
            >
                <Drawer
                    width={220}
                    docked={false}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}
                >
                    <AppBar onLeftIconButtonClick={this.handleToggle}/>
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
