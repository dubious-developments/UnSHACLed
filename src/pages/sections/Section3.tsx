import * as React from 'react';
import {Header, Image} from 'semantic-ui-react';

class Section3 extends React.Component<any, any> {

    const;
    imgMargin = {
        marginTop: '1em',
        marginBottom: '1em'
    };

    render() {
        const s31 = require('../../img/user_manual/s3_1.png');
        const s32 = require('../../img/user_manual/s3_2.png');
        const s33 = require('../../img/user_manual/s3_3.png');
        const s34 = require('../../img/user_manual/s3_4.png');
        const s35 = require('../../img/user_manual/s3_5.png');
        const s36 = require('../../img/user_manual/s3_6.png');
        const s37 = require('../../img/user_manual/s3_7.png');
        const s38 = require('../../img/user_manual/s3_8.png');
        const s39 = require('../../img/user_manual/s3_9.png');
        const s310 = require('../../img/user_manual/s3_10.png');
        return (
            <div style={{marginTop: '2em'}}>
                <Header as="h1"> File Handling </Header>
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
                    located within the 'File' option in the toolbar at the top of the editors screen. Only files with a
                    <b> .ttl </b> extension are currently supported by the editor.
                </p>

                {/** Open local files **/}

                <Header as='h2' color="teal"> Open local files </Header>
                <p> The following will guide you through the process of <b> opening local files </b> into the editor.
                </p>
                <Image src={s31} centered={true} style={this.imgMargin}/>
                <p> First open the 'File' dropdown from the toolbar, as made visible in the figure above. This will
                    bring up the following:</p>
                <Image src={s32} centered={true} style={this.imgMargin}/>
                <p> Next, select the 'Open local graph' option from the dropdown. A horizontal dropdown will open
                    which allows the user to choose between importing either a data graph or SHACL graph. An example
                    can be seen below:</p>
                <Image src={s35} centered={true} style={this.imgMargin}/>
                <p>Selecting one should result in the editor opening
                    a file picker, enabling the user to select their local file and open it through the editor.
                    If a valid data or SHACL graph was specified, the editor will load and represent the file as a
                    graph.
                    <b> Note</b> that the editor allows opening multiple files in one session. A user can open and edit
                    multiple files simultaneously and store them individually. For more information on how to store
                    files, see the sections on 'save local files'. An example of how the file picker looks like is given
                    below:
                </p>
                <Image src={s36} centered={true} style={this.imgMargin}/>

                {/** Save local files**/}

                <Header as='h2' color="teal"> Save local files </Header>
                <p> The following will guide you through the process of <b> saving local files </b>. </p>
                <Image src={s31} centered={true} style={this.imgMargin}/>
                <p> First open the 'File' dropdown from the toolbar, as made visible in the figure above. This will
                    bring up the following:</p>
                <Image src={s32} centered={true} style={this.imgMargin}/>
                <p> Next select the 'Save local graph' option from the dropdown. A horizontal dropdown will open
                    which allows the user to choose between the currently opened files. Two options are available here.
                    If no files were opened, the following option can be observed:
                </p>
                <Image src={s37} centered={true} style={this.imgMargin}/>
                <p>
                    As no files were opened in the editor, the user is not able to save. If you see this, please open
                    a file first as described in the section on how to 'open local files'. If files were openend, the
                    editor should give the follwing option:
                </p>
                <Image src={s38} centered={true} style={this.imgMargin}/>
                <p>
                    Here one is able to choose which of the currently opened files to store locally. After selecting
                    the file of choice, the editor will generate a .ttl file which will be downloaded by your
                    browser and store wherever you set your Downloads folder.
                </p>

                {/** Open files to your account **/}

                <Header as='h2' color="teal"> Open files from your account </Header>
                <p> The following will guide you through the process of <b> opening from your remote account </b>
                    into the editor.
                </p>
                <Image src={s31} centered={true} style={this.imgMargin}/>
                <p> First open the 'File' dropdown from the toolbar, as made visible in the figure above. This will
                    bring up the following:</p>
                <Image src={s32} centered={true} style={this.imgMargin}/>
                Next, select the <b>'Open graph from account'</b> option from the dropdown.
                Following pop-up will be visible on screen:
                <Image src={s39} centered={true} style={this.imgMargin}/>
                <p> Through this pop-up screen, select one of your project from the selection field. If your
                    authentication was successful, all your projects linked to your account should be visible.
                    Selecting a project will result in a extra selection field being visible. An example of this
                    is given below:
                </p>
                <Image src={s310} centered={true} style={this.imgMargin}/>
                <p> Now select a file of your choice within your previously selected project in the appeared
                    selection menu. If you select both a project and file, the 'Open' button should no longer be
                    disabled. After selecting a file, specify the type of file you want to upload. Choose 'data' if you
                    want to open a data graph or choose 'SHACL' if you want to open a SHACL graph.
                    If you are satisfied with your choice, click the 'Open' button. This will open
                    the remote file into the editor. If the selected file is a valid <b>.ttl</b> file and a valid
                    data or SHACL graph, the editor will load and represent your remote file as a graph.
                    If you want to cancel the process of creating a open a remote graph, you can either
                    click the 'Cancel' button or the closing icon in the top right corner of the pop-up.
                </p>

                {/** Save files to your account**/}

                <Header as='h2' color="teal"> Save files to your account </Header>
                <p> The following will guide you through the process of <b> saving files to your remote account</b>
                </p>
                <Image src={s31} centered={true} style={this.imgMargin}/>
                <p> First open the 'File' dropdown from the toolbar, as made visible in the figure above. This will
                    bring up the following:</p>
                <Image src={s32} centered={true} style={this.imgMargin}/>
                <p> Next select the 'Save graph to account' option from the dropdown. A horizontal dropdown will open
                    which allows the user to choose between the currently opened files. Two options are available here.
                    If no files were opened, the following option can be observed:
                </p>
                <Image src={s37} centered={true} style={this.imgMargin}/>
                <p>
                    As no files were opened in the editor, the user is not able to save. If you see this, please open
                    a file first as described in the section on how to 'open graph from your account'.
                    If files were openened, the editor should give the following option:
                </p>
                <Image src={s38} centered={true} style={this.imgMargin}/>
                <p>
                    Here one is able to choose which of the currently opened files to store locally. After selecting
                    the file of choice, the editor will store the file into your remote project linked to your
                    account.
                </p>

                {/** Create new project **/}
                <Header as='h2' color="teal"> Create new projects </Header>
                <p> The following will guide you through the process of <b> creating new project for your
                    remote account </b>
                </p>
                <Image src={s31} centered={true} style={this.imgMargin}/>
                <p> First open the 'File' dropdown from the toolbar, as made visible in the figure above. This will
                    bring up the following:</p>
                <Image src={s32} centered={true} style={this.imgMargin}/>
                <p> Next select the 'New Project' option from the dropdown. Following pop-up will be visible on screen:
                </p>
                <Image src={s33} centered={true} style={this.imgMargin}/>
                <p>
                    Through this pop-up screen, choose a fitting name for the project you want to create
                    in the input field. Whenever the input field is not empty, the 'Create' button will no longer be
                    disabled. If you are satisfied with your chosen project name, click 'Create' button. The editor
                    will create a project and link it to your account. As this project is newly created, it does
                    not contain any files yet. To do so, add new files as described in the 'Create new files in
                    a project' section. If you want to cancel the process of creating a new project, you can either
                    click the 'Cancel' button or the closing icon in the top right corner of the pop-up.
                </p>

                {/** Create new files in a project **/}

                <Header as='h2' color="teal"> Create new files in a project </Header>
                <p> The following will guide you through the process of <b> creating new files for a project linked
                    to your remote account </b>
                </p>
                <Image src={s31} centered={true} style={this.imgMargin}/>
                <p> First open the 'File' dropdown from the toolbar, as made visible in the figure above. This will
                    bring up the following:</p>
                <Image src={s32} centered={true} style={this.imgMargin}/>
                <p> Next select the 'New File' option from the dropdown. Following pop-up will be visible on screen:
                </p>
                <Image src={s34} centered={true} style={this.imgMargin}/>
                <p>
                    Through this pop-up screen, select one of your projects from the selection field. If your
                    authentication was successful, all your projects linked to your account should be visible.
                    After selecting a project, choose a fitting name for the file you want to create
                    in the input field. Whenever the input field is not empty, the 'Create' button will no longer be
                    disabled. If you are satisfied with your chosen file name and project,
                    click 'Create' button. The editor will create a new file and store it into your remote project.
                    <b> Note </b> that the editor will <b> not </b> open the newly created file. To start editing
                    in this file, please open the file first as described in 'Open graph from account' section.
                    If you want to cancel the process of creating a new project, you can either
                    click the 'Cancel' button or the closing icon in the top right corner of the pop-up.
                </p>

                {/** Load and save workspace **/}
                <Header as='h2' color="teal"> Load and save workspace </Header>
                <p> The following will guide you through the process of <b> loading or saving your current workspace
                </b>
                </p>
                <Image src={s31} centered={true} style={this.imgMargin}/>
                <p> First open the 'File' dropdown from the toolbar, as made visible in the figure above. This will
                    bring up the following:</p>
                <Image src={s32} centered={true} style={this.imgMargin}/>
                <p> Next select the 'Load workspace' or'Save workspace' option from the dropdown.
                </p>
                <p>
                    When 'Load workspace' is chosen, the last stored workspace of the authenticated user
                    is loaded in from the server. You can now see where you left off the last time
                    you saved your workspace. When 'Save workspace" is chosen, the current workspace
                    is stored on the server which allows to load it back in during another sessions.
                </p>
            </div>
        );
    }
}

export default Section3;
