import * as React from 'react';
import {Modal, Button, Icon, Dropdown} from 'semantic-ui-react';
import {RepoModalProps} from '../components/interfaces/interfaces';
import RequestModule from '../requests/RequestModule';
import {connect} from 'react-redux';

/**
 Component used to create a modal for opening files from projects
 Requires several props from the parent, which can be found in interfaces.d.ts

 */
class RepoModal extends React.Component<RepoModalProps & any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            selected: true,
            files: true,
            repos: []
        };
        this.setSelected = this.setSelected.bind(this);
        this.setFilesSelected = this.setFilesSelected.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.confirmModal = this.confirmModal.bind(this);
        this.processRepos = this.processRepos.bind(this);
    }

    /**
     * Method immediately invoked when this component is mounted.
     * Will request the repositories from the currently authenticated user through the Request module
     * and set the component state according to its results.
     */
    componentDidMount() {
        RequestModule.getUserRepos(this.props.token).then(repoArray => {
            this.processRepos(repoArray);
        });
    }

    /**
     * Method that will map an array of repos required from the API to
     * an array able to be loaded in a Dropdown UI component.
     * @param repoArray
     */
    processRepos(repoArray: any) {
        /* set state */
        this.setState({
            repos: RequestModule.processRepos(repoArray)
        });
    }

    /**
     * Method that will adapt the current state of the 'selected' attribute
     * which is used to determine if a second dropdown should be visible or not.
     * @param: none
     * @return: none
     */
    setSelected() {
        this.setState({
            selected: false
        });
    }

    /**
     * Method that will adapt the current state of the 'files' attribute
     * which is used to determine wether the confirm button should be
     * enable or disabled.
     * @param: none
     * @return: none
     */
    setFilesSelected() {
        this.setState({
            files: false
        });
    }

    /**
     * Function fired when a user click the cancel button on the modal.
     * Will adapt the current state to its initial settings and will call the callback
     * function received from the parent which will handle the cancel functionality.
     * @param: none
     * @return: none
     */
    cancelModal() {
        this.props.cancel_cb("RepoModal");
        this.setState({
            files: true,
            selected: true
        });
    }

    /**
     * Function fired when a user click the confirm button on the modal.
     * Will adapt the current state to its initial settings and will call the callback
     * function received from the parent which will handle the confirm functionality.
     * @param: none
     * @return: none
     */
    confirmModal() {
        this.props.confirm_cb("RepoModal");
        this.setState({
            files: true,
            selected: true
        });
    }

    render() {
        let graphs = [{text: " File 1", value: "File 1"}, {text: " File 2", value: "File 2"}];
        let {selected, files, repos} = this.state;
        return (
            <div>
                <Modal
                    open={this.props.visible}
                    style={{
                        marginTop: '0 !important',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }}
                    closeIcon={true}
                    onClose={this.cancelModal}
                >
                    <Modal.Header>GitHub repo's</Modal.Header>
                    <Modal.Content>
                        <Dropdown
                            placeholder='Select Project'
                            fluid={true}
                            selection={true}
                            options={repos}
                            onChange={this.setSelected}
                        />
                        {selected === false && (
                            <Dropdown
                                placeholder='Select Graph File'
                                fluid={true}
                                selection={true}
                                options={graphs}
                                onChange={this.setFilesSelected}
                            />)
                        }
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={this.cancelModal}>
                            <Icon name='remove'/> Cancel
                        </Button>
                        <Button color='green' onClick={this.confirmModal} disabled={files}>
                            <Icon name='checkmark'/> Open
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

/**
 * Map global store to props of this component.
 * @param state: state retrieved from the global redux store.
 * @returns {{token}}: sets props.token
 */
const mapStateToProps = (state, props) => {
    return {
        token: state.token
    };
};

export default connect(mapStateToProps)(RepoModal);