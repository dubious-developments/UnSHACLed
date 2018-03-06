// Custom theme
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

const getTheme = () => {
    let overwrites = {
        'palette': {
            'primary1Color': '#00bfa5',
            'primary2Color': '#00695c',
            'accent1Color': 'rgba(255, 255, 255, 0.87)',
            'accent2Color': '#9e9e9e',
            'accent3Color': '#424242',
            'secondaryTextColor': 'rgba(0, 0, 0, 0.26)',
            'textColor': '#00bfa5'
        },
        'appBar': {
            'textColor': '#ffffff',
            'height': 50,
            'titleFontWeight': 200,
            'padding': 25
        },
        'tabs': {
            'textColor': '#ffffff'
        }
    };
    return getMuiTheme(baseTheme, overwrites);
};

export const muiTheme = getTheme();
