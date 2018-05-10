import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {HashRouter} from 'react-router-dom';
import Routes from "./components/Routes";
import 'semantic-ui-css/semantic.min.css';
import {createStore, combineReducers} from 'redux';
import {userNameReducer, userLoginReducer, userEmailReducer, userTokenReducer} from './redux/reducers/userReducer';

const allReducers = combineReducers(
    {
        name: userNameReducer,
        login: userLoginReducer,
        email: userEmailReducer,
        token: userTokenReducer
    }
);
const store = createStore(allReducers);

const updateUserAction = {
    type: 'updateUsername',
    payload: {
        name: 'name of user'
    }
};

const updateUserlogin = {
    type: 'updateUserLogin',
    payload: {
        login: 'here comes login'
    }
};

console.log(store.getState());

store.dispatch(updateUserAction);
store.dispatch(updateUserlogin);

console.log(store.getState());

ReactDOM.render(
    <HashRouter>
        <Routes/>
    </HashRouter>,
    document.getElementById('root'));
registerServiceWorker();
