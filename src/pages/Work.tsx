import * as React from 'react';
import Navbar from '../components/navbarWork';
import SideBar from '../components/Sidebar';
import MxGraph from '../components/MxGraph';
import { Grid } from 'semantic-ui-react';

class Workspace extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {menuVisible: false};
    }

    render() {
        return (
            <Grid style={{height: '100vh'}}>
                <Grid.Row style={{height: '10%', paddingBottom: 0}}>
                    <Grid.Column>
                        <Navbar/>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={16} style={{height: '90%', paddingTop: 0}} stretched={true}>
                    <Grid.Column width={2} style={{paddingRight: 0}}>
                        <SideBar/>
                    </Grid.Column>
                    <Grid.Column width={14} style={{paddingLeft: 0}}>
                        <MxGraph/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
            ;
    }
}
export default Workspace;
