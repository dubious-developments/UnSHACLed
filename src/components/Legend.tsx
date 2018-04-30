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
    }

    render() {
        return (
            <div>
                <Header
                    inverted={true}
                    content="Show Legend"
                    floated="left"
                    size="tiny"
                    style={{verticalAlign: 'middle', fontWeight:'lighter'}}
                />
                <Popup
                    trigger={<Checkbox/>}
                    content={
                        <List verticalAlign='middle'>
                            <List.Item>
                                <Icon style={{ color: '#A1E44D'}} name="square"/>
                                <List.Content>
                                    <List.Header> Shape </List.Header>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <Icon style={{ color: '#2FBF71'}} name="square"/>
                                <List.Content>
                                    <List.Header> Property </List.Header>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <Icon style={{ color: '#7D26CD'}} name="square"/>
                                <List.Content>
                                    <List.Header> Property Attribute </List.Header>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <Icon style={{ color: '#7D26CD'}} name="square"/>
                                <List.Content>
                                    <List.Header> Data </List.Header>
                                </List.Content>
                            </List.Item>
                        </List>
                    }
                    on='click'
                    position='right center'
                />
            </div>

        );
    }
}

export default Legend;