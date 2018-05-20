import * as React from 'react';
import {Header, List} from 'semantic-ui-react';

class Section8 extends React.Component<any, any> {

    imgMargin = {
        marginTop: '1em',
        marginBottom: '1em'
    };

    render() {
        return (
            <div style={{marginTop: '2em'}}>
                <Header as="h1"> Collaborative editing </Header>
                <p> A strong feature of the UnSHACLed editor is the possibility to collaboratively
                    work on editing data or constraints. The following section will contain a short
                    description on several situations that can occur when working collaboratively.
                    For a more technical description on how the collaborative aspect was achieved, please
                    consult our other documentation.
                </p>
                {/** Collaborative workflow  */}
                <Header as="h2" color="teal"> Collaborative situations </Header>
                <p>
                    When working collaboratively with other people, the following examples could occur.
                    However, these are example situations and hence real-life situations could differ slightly.
                </p>
                <List bulleted={true}>
                    <List.Item>
                        <b> I can't edit some graph components? </b> This indicates that someone else is currently
                        working on that part of the graph. When the other person is ready, his/her changes should
                        arrive soon at your end after which you can resume the editing.
                    </List.Item>
                    <List.Item>
                        <b> Some graph components changed on their own? </b>
                        This indicates that someone else was
                        working on that part of the graph and his/her changes arrived at your end.
                    </List.Item>
                    <List.Item>
                        <b> Why can't I save a file? </b>
                        If you file is not available under the 'Save graph to account' option, someone else
                        is currently working on that part of the graph. To prevent you from (un)intentionally
                        overwriting their changes, you need to wait untill their changes arrives before you can
                        store the file remotely.
                    </List.Item>
                </List>
            </div>
        );
    }
}

export default Section8;
