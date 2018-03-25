import * as React from 'react';
import Navbar from '../components/navbarWork';
import SideBar from '../components/Sidebar';
import MxGraph from '../components/MxGraph';
import { Sidebar, Segment } from 'semantic-ui-react';

class Workspace extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            menuVisible: true,
            dragid: null
        };

        this.callBackNavBar = this.callBackNavBar.bind(this);
        this.idCallback = this.idCallback.bind(this);
    }

    callBackNavBar(childData: boolean) {
        this.setState({
            menuVisible: childData
        });
    }

    idCallback(childData: string) {
        this.setState({
            dragid: childData
        });
    }

    render() {
        const {menuVisible} = this.state;
        const {dragid} = this.state
        return (
            <Sidebar.Pushable style={{width: '100%', height: '100%'}}>
                <SideBar visible={menuVisible} callback={this.idCallback}/>
                <Sidebar.Pusher style={{height: '100vh', padding: '0em 0em'}}>
                    <Segment basic={true} style={{height: '100vh', padding: '0em 0em'}}>
                        <Navbar visible={menuVisible} callback={this.callBackNavBar}/>
                        <MxGraph dragid={dragid}/>
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }
}

export default Workspace;
