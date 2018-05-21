import * as React from 'react';
import Navbar from '../components/navbarWork';
import SideBar from '../components/Sidebar';
import MxGraph from '../components/MxGraph';
import {connect} from 'react-redux';
import {Sidebar, Segment, Menu} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";

/**
 * Component containing the content of the user-manual page.
 */
class Workspace extends React.Component<any, any> {
    /**
     * Constructor of component
     * @param props
     */
    constructor(props: any) {
        super(props);
        this.state = {
            menuVisible: true,
            dragid: null,
            // TODO enable search for this
            templates: [],
            errorLabel: false
        };
        // bind methods
        this.callBackNavBar = this.callBackNavBar.bind(this);
        this.idCallback = this.idCallback.bind(this);
        this.templateCallback = this.templateCallback.bind(this);
        this.setLabel = this.setLabel.bind(this);
    }

    /**
     * Lifecycle method invoked when component will mount. Will redirect if not correctly authenticated.
     */
    componentWillMount() {
        if (this.props.auth === false) {
            this.props.history.push("/login");
        }
    }

    /**
     * Callback function invoked when a child component does a callback.
     * Will toggle the visiblity of the sidebar (menuVisible).
     * @param {boolean} childData: data received from the child
     */
    callBackNavBar(childData: boolean) {
        this.setState({
            menuVisible: childData
        });
    }

    /**
     * Callback function invoked when a child component does a callback.
     * Will toggle the value of the dragid.
     * @param {boolean} childData: data received from the child
     */
    idCallback(childData: string) {
        this.setState({
            dragid: childData
        });
    }

    /**
     Callback function to set content of template sidebar entry according
     to click events from the mxGraph component, templates is passed to the child
     component Sidebar, which is a sibling component of mxGraph.
     @param name: name of template
     @param count: number of selected components
     */
    templateCallback(name: string, count: any) {
        this.setState({
            templates: this.state.templates.concat(
                <Menu.Item
                    as="a"
                    content={name}
                    key={name + count}
                    id={name + count}
                />
            )
        });
        console.log("called callback wiht" + name);
    }

    /**
     * Callback function invoked when a child component does a callback.
     * Will toggle the visiblity of error label for adding templates.
     * @param {boolean} childData: data received from the child
     */
    setLabel(val: boolean) {
        this.setState({
            errorLabel: val
        });
    }

    /** Render component **/
    render() {
        const {menuVisible} = this.state;
        const {templates} = this.state;
        const {errorLabel} = this.state;
        return (
            <div id="wrapper" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <Navbar visible={menuVisible} callback={this.callBackNavBar}/>
                <Sidebar.Pushable style={{flex: 1, height: '100%'}}>
                    <SideBar
                        visible={menuVisible}
                        callback={this.idCallback}
                        templates={templates}
                        showLabel={errorLabel}
                    />
                    <Sidebar.Pusher style={{height: '100%'}}>
                        <Segment basic={true} style={{height: '100vh', padding: 0}}>
                            <MxGraph callback={this.templateCallback} setLabel={this.setLabel}/>
                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        );
    }
}

/**
 * Map global store to props of this component.
 * @param state: state retrieved from the global redux store.
 */
const mapStateToProps = (state) => ({
    auth: state.auth
});

const ConWorkspace = connect(mapStateToProps)(Workspace);
export default withRouter(ConWorkspace);