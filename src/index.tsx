import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {HashRouter} from 'react-router-dom';
import Routes from "./components/Routes";
import 'semantic-ui-css/semantic.min.css';
import {createStore, combineReducers} from 'redux';
import {userNameReducer, userLoginReducer, userEmailReducer, userTokenReducer} from './redux/reducers/userReducer';
import {Provider} from 'react-redux';

const allReducers = combineReducers(
    {
        name: userNameReducer,
        login: userLoginReducer,
        email: userEmailReducer,
        token: userTokenReducer
    }
);
const store = createStore(allReducers);

console.log(store.getState());

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <Routes/>
        </HashRouter>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
