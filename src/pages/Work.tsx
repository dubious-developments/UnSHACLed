import * as React from 'react';
import Navbar from '../components/navbarWork';
import SideBar from '../components/Sidebar';
import {Segment, Sidebar } from 'semantic-ui-react';

class Workspace extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {menuVisible: false};
    }

    render() {
        return (
            <div className="workPage">
                <Sidebar.Pushable as={Segment} style={{ minHeight: 835}}>
                   <SideBar/>
                    <Navbar/>
                    <Sidebar.Pusher>
                        <h1> Application Content </h1>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>

        )
            ;
    }
}
export default Workspace;
