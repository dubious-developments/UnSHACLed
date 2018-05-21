import * as React from 'react';
import {Dropdown} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import UserModal from '../modals/UserModal';
import {DataAccessProvider} from "../persistence/dataAccessProvider";

/*
    Component used to create a dropdown component for an authenticated user

 */
class DropdownUser extends React.Component<any, any> {

    /**
     * Constructor of component
     * @param props
     */
    constructor(props: any) {
        super(props);
        this.state = {
            infoVisible: false
        };
        this.closeModalCallback = this.closeModalCallback.bind(this);
        this.showUserModal = this.showUserModal.bind(this);
        this.stopPollingService = this.stopPollingService.bind(this);
    }

    /**
     * Method to toggle the visibility of the user modal (child component).
     * Invoken on clicking 'My Profile' option.
     */
    showUserModal() {
        this.setState({
            infoVisible: true
        });
    }

    /**
     * Callback function to child component, which is called when the child modal is closed.
     * Will set the child modal visibility to false
     * @param data: callback data received from the child
     */
    closeModalCallback(data: any) {
        this.setState({
            infoVisible: false
        });
    }

    /**
     * Method that will invoke the backedn and stop all polling services
     * @return: none
     */
    stopPollingService() {
        let remotefileDAO = DataAccessProvider.getInstance().getRemoteFileDAO();
        remotefileDAO.stop();
    }

    /** Render component **/
    render() {
        let {infoVisible} = this.state;
        console.log(this.props);
        return (
            <div>
                <Dropdown text={this.props.name} pointing="top right">
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            Signed in as <b> {this.props.login} </b>
                        </Dropdown.Item>
                        <Dropdown.Item text='My Profile' onClick={this.showUserModal}/>
                        <Dropdown.Item as={Link} to="/login" onClick={this.stopPollingService}>
                            Sign out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                {infoVisible ?
                    <UserModal visible={infoVisible} login={this.props.login} onClose_cb={this.closeModalCallback}/>
                    : null
                }

            </div>
        );
    }
}

/**
 * Map global store to props of this component.
 * @param state: state retrieved from the global redux store.
 */
const mapStateToProps = (state) => ({
    name: state.name,
    login: state.login
});

export default connect(mapStateToProps)(DropdownUser);