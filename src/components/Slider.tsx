import * as React from 'react';
import '../style/App.css';
import Slider from 'material-ui/Slider';

/** Deprecated Slider component */

class SliderClass extends React.Component {
    /** Render component **/
    render() {
        return (
            <div>
                <p> Zoom </p>
                <Slider defaultValue={0.2} style={{width: 200}}/>
            </div>
        );
    }
}

export default SliderClass;