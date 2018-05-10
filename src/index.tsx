import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {HashRouter} from 'react-router-dom';
import Routes from "./components/Routes";
import 'semantic-ui-css/semantic.min.css';
import {createStore, combineReducers} from 'redux';
import userReducer from './redux/reducers/userReducer';

const allReducers = combineReducers(
    {
        user: userReducer
    }
);
const store = createStore(allReducers);

const updateUserAction = {
    type: 'updateUserAction',
    payload: {
        user: 'name of user'
    }
};

console.log(store.getState());

store.dispatch(updateUserAction);

console.log(store.getState());

ReactDOM.render(
    <HashRouter>
        <Routes/>
    </HashRouter>,
    document.getElementById('root'));
registerServiceWorker();
