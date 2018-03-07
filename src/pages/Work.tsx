import * as React from 'react';
import Navbar from '../components/navbarWork';
import SideBar from '../components/Sidebar';

class Workspace extends React.Component {

    render() {
        return (
            <div>
                        <Navbar/>
                        <SideBar/>
            </div>
        )
            ;
    }
}
export default Workspace;
