import * as React from 'react';
import {List, Icon, Popup, Header, Checkbox} from 'semantic-ui-react';
import {LegendProps} from './interfaces/interfaces';

/*
    Component used to create a legend
    Requires several props from the parent, which can be found in interfaces.d.ts

 */
class Legend extends React.Component<LegendProps, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            entries: []
        };

        this.fillList = this.fillList.bind(this);
    }

    componentDidMount() {
        this.fillList();
    }

    fillList() {
        console.log('filing list');
        var legend = [] as any[];
        /* Check for same length */
        if (this.props.colors.length === this.props.entries.length) {
            for (let i in this.props.colors) {
                /* Create List entry and push to array */
                legend.push(
                    <List.Item key={i}>
                        <Icon style={{color: this.props.colors[i]}} name="square"/>
                        <List.Content>
                            <List.Header> {this.props.entries[i]} </List.Header>
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

    render() {
        let {entries} = this.state;
        return (
            <div>
                <Header
                    inverted={true}
                    content={this.props.header_title}
                    floated="left"
                    size="tiny"
                    style={{verticalAlign: 'middle', fontWeight: 'lighter'}}
                />
                <Popup
                    trigger={<Checkbox/>}
                    content={
                        <List
                            verticalAlign='middle'
                            items={entries}
                        />
                    }
                    on='click'
                    position='right center'
                />
            </div>

        );
    }
}

export default Legend;