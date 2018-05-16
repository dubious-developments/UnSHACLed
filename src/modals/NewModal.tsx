import * as React from 'react';
import {Modal} from 'semantic-ui-react';
import {NewModalProps} from '../components/interfaces/interfaces';
import RequestModule from '../requests/RequestModule';
import {connect} from 'react-redux';

/*
    Component used to create a model for new file/project creation.
    Requires several props from the parent, which can be found in interfaces.d.ts

 */
class NewModal extends React.Component<NewModalProps & any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            selected: true,
            repos: []
        };
    }

    componentDidMount() {
        RequestModule.getUserRepos(this.props.token).then(repoArray => {
            console.log(repoArray);
            this.processRepos(repoArray);
        });
    }

    /**
     * Method that will map an array of repos required from the API to
     * an array able to be loaded in a Dropdown UI component.
     * @param repoArray
     */
    processRepos(repoArray: any) {
        let result: any[] = [];
        for (let i in repoArray) {
            result.push(
                {
                    text: repoArray[i].split("/")[1],
                    value: repoArray[i].split("/")[1]
                }
            );
        }
        console.log(result);
        /* set state */
        this.setState({
            repos: result
        });
    }

    cancelModal() {
        this.props.cancel_cb("RepoModal");
        this.setState({
            files: true,
            selected: true
        });
    }

    confirmModal() {
        this.props.confirm_cb("RepoModal");
        this.setState({
            files: true,
            selected: true
        });
    }

    render() {
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
                >
                    <Modal.Header>S Header</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <p> Test </p>
                        </Modal.Description>
                    </Modal.Content>
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

export default connect(mapStateToProps)(NewModal);