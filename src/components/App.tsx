import * as React from 'react';
import '../style/App.css';
import AppBar from 'material-ui/AppBar';
import Slider from './Slider';
import Drawer from 'material-ui/Drawer';
import SideBar from './Sidebar';
import RaisedButton from 'material-ui/RaisedButton';
import { Redirect } from 'react-router';
import Auth from "../Auth";
import { withRouter } from 'react-router-dom';

// hotfix for navbar
const styles = {
    appBar: {
        flexWrap: "wrap",
    },
    floatRight: {
        float: "right",
    },
};

class App extends React.Component<any, any> {

    allowedExtensions = ".n3,.ttl,.rdf";

    constructor(props: string) {
        super(props);
        this.state = {
            open: false,
        };
        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle(): void {
        this.setState(prevState => ({
            open: !prevState.open
        }));
    }

  render() {
      if (! Auth.isLoggedIn()) {
          return <Redirect to={"/login"} />;
      } else {
          return (
              <div>
                  <AppBar
                      title="UnSHACLed"
                      style={{flexWrap: "wrap"}}
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

                      <div style={styles.floatRight}>
                          <RaisedButton primary={true} label="import Project"/>
                          <RaisedButton primary={true} label="save Project"/>
                          <RaisedButton primary={true} label="import Graph" onClick={this.uploadFileButton}/>
                          <input
                              type="file"
                              id="importGraph"
                              style={{"display" : "none"}}
                              accept={this.allowedExtensions}
                          />
                          <RaisedButton primary={true} label="save Graph"/>
                          <RaisedButton
                              secondary={true}
                              label="log out"
                              onClick={(event) => this.logoutButton(event)}
                          />
                      </div>
                  </AppBar>

                  <div className="footer">
                      <Slider/>
                  </div>
              </div>
          );
      }
    }

    logoutButton(event: any) {
        Auth.logout();
        this.props.history.push("/login");
    }

    uploadFileButton() {
        var input = document.getElementById("importGraph");
        input.click();
    }
}

export default withRouter(App);
