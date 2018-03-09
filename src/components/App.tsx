import * as React from 'react';
import '../style/App.css';
import { Redirect } from 'react-router';
import Auth from "../services/Auth";
import { withRouter } from 'react-router-dom';

class App extends React.Component<any, any> {

  render() {
      if (! Auth.isLoggedIn()) {
          return <Redirect to={"/login"} />;
      } else {
          return (
              <div><h1>Hello World </h1></div>
          );
      }
    }
}

export default withRouter(App);
