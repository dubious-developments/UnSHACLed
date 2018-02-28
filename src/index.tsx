import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { muiTheme } from './theme';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const Main = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <App />
    </MuiThemeProvider>
);

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
