import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { HashRouter } from 'react-router-dom';
import Routes from "./components/Routes";
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(
    <HashRouter >
        <Routes />
    </HashRouter>,
    document.getElementById('root'));
registerServiceWorker();
