import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from "../pages/Login";
import Home from "../pages/Home";

class Routes extends React.Component<any, any> {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact={true} path="/" component={Home}/>
                    <Route path="/login" component={Login}/>
                </Switch>
            </div>
        );
    }
}

export default Routes;