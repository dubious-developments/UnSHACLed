import * as React from 'react';
import {List, Icon, Header, Checkbox} from 'semantic-ui-react';
import {LegendProps} from './interfaces/interfaces';

/**
 Component used to create a legend
 Requires several props from the parent, which can be found in interfaces.d.ts

 **/
class Legend extends React.Component<LegendProps, any> {

    /**
     * Constructor of component
     * @param props
     */
    constructor(props: any) {
        super(props);

        this.state = {
            entries: [],
            visible: false
        };

        this.fillList = this.fillList.bind(this);
        this.onCheck = this.onCheck.bind(this);

    }

    /**
     * Life cycle method invoked when the component is mounted.
     * Will invoke the fillList() method.
     */
    componentDidMount() {
        this.fillList();
    }

    /**
     * Method that will adapt the component state when the checkbox is clicked.
     * Will set 'visible' state to the inverse of its current state
     */
    onCheck() {
        this.setState({
            visible: !this.state.visible
        });
    }

    /**
     * Method that will fill the content of the legend based on the props it received.
     * Required props are defined in interfaces.d.ts.
     */
    fillList() {
        var legend = [] as any[];
        /* Check for same length */
        if (this.props.colors.length === this.props.entries.length) {
            for (let i in this.props.colors) {
                /* Create List entry and push to array */
                legend.push(
                    <List.Item key={i}>
                        <Icon style={{color: this.props.colors[i]}} name="square"/>
                        <List.Content>
                            <List.Header
                                style={{fontWeight: 'lighter', color: '#848585'}}
                            > {this.props.entries[i]}
                            </List.Header>
                        </List.Content>

                    </List.Item>
                );
            }
        } else {
            console.log('List are not of the same length');
        }
        /* Set state */
        this.setState({
            entries: legend
        });
    }

    /** Render component **/
    render() {
        let {entries} = this.state;
        let {visible} = this.state;
        return (
            <div>
                <Header
                    inverted={true}
                    content={this.props.header_title}
                    floated="left"
                    size="tiny"
                    style={{verticalAlign: 'middle', fontWeight: 'lighter'}}
                />
                <Checkbox onClick={this.onCheck}/>
                {visible === true &&
                <List
                    inverted={true}
                    verticalAlign='middle'
                    items={entries}
                />
                }
            </div>

        );
    }
}

export default Legend;