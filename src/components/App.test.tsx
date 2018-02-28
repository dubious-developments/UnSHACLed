import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { muiTheme } from '../theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
      <App />
    </MuiThemeProvider>,
    div);
});
