module.exports = {
    presets: [
        ['env', {
            'targets': {
                'browsers': [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'IE 11',
                    'not ie < 9']
            }
        }]
    ],
    babelrc: false
}
