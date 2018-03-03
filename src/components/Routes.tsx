import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from "./Login";
import App from "./App";

class Routes extends React.Component<any, any> {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/" component={App}/>
                    <Route path="/login" component={Login}/>
                </Switch>
            </div>
        );
    }
}

export default Routes;