import * as React from 'react';
import '../style/App.css';
import Slider from 'material-ui/Slider';

class SliderClass extends React.Component {
    render() {
        return (
            <div>
                <p> Zoom </p>
                <Slider defaultValue={0.2}  style={{width: 200}}/>
            </div>
        );
    }
}

export default SliderClass;