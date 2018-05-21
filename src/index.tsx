import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {HashRouter} from 'react-router-dom';
import Routes from "./components/Routes";
import 'semantic-ui-css/semantic.min.css';
import {createStore, combineReducers} from 'redux';
import {userNameReducer, userLoginReducer, userEmailReducer, userTokenReducer} from './redux/reducers/userReducer';
import {fileReducer} from "./redux/reducers/fileRecuder";
import {lockReducer} from "./redux/reducers/lockReducer";

import {Provider} from 'react-redux';

/** Gather all redux reducers in a combinedreducer */
const allReducers = combineReducers(
    {
        name: userNameReducer,
        login: userLoginReducer,
        email: userEmailReducer,
        token: userTokenReducer,
        files: fileReducer,
        locks: lockReducer
    }
);
/** Create the global redux store by passing all redux reducers as a combined reducer */
const store = createStore(allReducers);

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <Routes/>
        </HashRouter>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
