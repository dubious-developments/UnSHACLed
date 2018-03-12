import * as React from 'react';
import {Treebeard} from 'react-treebeard';

const data = {
    name: 'root',
    children: [
        {
            name: 'parent',
            children: [
                { name: 'child1' },
                { name: 'child2' }
            ]
        }
    ]
};

class Tree extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node: any, toggled: any) {
        if (this.state.cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState({
            cursor: node
        });
    }

    render() {
        return (
            <div>
                <Treebeard
                    data={data}
                    onToggle={this.onToggle}
                />
            </div>
        );
    }
}
export default Tree;