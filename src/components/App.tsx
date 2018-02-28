import * as React from 'react';
import '../style/App.css';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

// hotfix for navbar
const styles = {
    appBar: {
        flexWrap: 'wrap',
    },
    floatRight: {
        float: "right",
    },
};

class App extends React.Component {
    allowedExtensions = ".n3,.ttl,.rdf";
  render() {
    return (
        <div>
            <AppBar
                title="UnSHACLed"
                style={styles.appBar}
                iconClassNameRight="muidocs-icon-navigation-expand-more"
            >
                <div style={styles.floatRight}>
                    <RaisedButton primary={true} label="import Project"/>
                    <RaisedButton primary={true} label="save Project"/>
                    <RaisedButton primary={true} label="import Graph" onClick={this.uploadFileButton} />
                    <input type="file" id="importGraph" style={{"display" : "none"}} accept={this.allowedExtensions} />
                    <RaisedButton primary={true} label="save Graph"/>
                </div>
            </AppBar>

        </div>
    );
  }

    uploadFileButton() {
        var input = document.getElementById("importGraph");
        input.click();
    }
}

export default App;
