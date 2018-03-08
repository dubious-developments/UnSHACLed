import * as React from 'react';
import Navbar from '../components/navbarWork';
import SideBar from '../components/Sidebar';
import { Grid } from 'semantic-ui-react';

class Workspace extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {menuVisible: false};
    }

    render() {
        return (
            <Grid style={{height: '100vh'}}>
                <Grid.Row style={{height: '10%'}}>
                    <Grid.Column>
                        <Navbar/>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row style={{height: '90%'}}>
                    <Grid.Column width={2}>
                        <SideBar/>
                    </Grid.Column>
                    <Grid.Column>
                        <p> Graphs here</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
            ;
    }
}
export default Workspace;
