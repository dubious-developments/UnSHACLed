import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { muiTheme } from './theme';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter } from 'react-router-dom';
import Routes from "./components/Routes";

const Main = () => (
    <BrowserRouter>
        <MuiThemeProvider muiTheme={muiTheme}>
            <Routes />
        </MuiThemeProvider>
    </BrowserRouter>
);

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
