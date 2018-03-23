import * as React from 'react';
import Navbar from '../components/navbarWork';
import SideBar from '../components/Sidebar';
import MxGraph from '../components/MxGraph';
import { Sidebar, Segment } from 'semantic-ui-react';

class Workspace extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {menuVisible: true};

        this.callBackNavBar = this.callBackNavBar.bind(this);
    }

    callBackNavBar(childData: boolean) {
        this.setState({
            menuVisible: childData
        });
    }
    render() {
        const {menuVisible} = this.state;
        return (
            <Sidebar.Pushable style={{width: '100%', height: '100%'}}>
                <SideBar visible={menuVisible}/>
                <Sidebar.Pusher style={{height: '100vh', padding: '0em 0em'}}>
                    <Segment basic={true} style={{height: '100vh', padding: '0em 0em'}}>
                        <Navbar visible={menuVisible} callback={this.callBackNavBar}/>
                        <MxGraph/>
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }
}

export default Workspace;
