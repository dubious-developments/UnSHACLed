import * as React from 'react';
import {Header} from 'semantic-ui-react';

class Section3 extends React.Component<any, any> {

    render() {
        return (
            <div style={{marginTop: '2em'}}>
                <Header> File Handling </Header>
                <p> There are a number of possible ways to store or retrieve files in the UnSHACLed editor. Two
                    main options are offered to the end user. First of all a local/offline option where a user
                    can load data/ SHACL graphs from their computer and store them locally as well. After the
                    authentication step, no further online connection is needed for this option.
                    The second option is a remote/online
                    option where a user can fetch and store their data/SHACL graph to their account. To make use of
                    UnSHACLed, users need to create a GitHub account. This account is linked to the UnSHACL editor
                    and allows storing and fetching of files remotely for each individual user. Consequently, a online
                    connection is required to be able to access and store your files. If a user wants to use
                    the collaborative feature of the editor, the second option is required. The following sections
                    contain information on how to execute each of these options. All file handling functions are
                    located within the 'File' option in the toolbar at the top of the editors screen.
                </p>
            </div>
        );
    }
}

export default Section3;
