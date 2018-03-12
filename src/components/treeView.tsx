import * as React from 'react';
import {Treebeard, decorators } from 'react-treebeard';
import {Icon} from 'semantic-ui-react';
import customStyle from '../style/treeView';

decorators.Header = ({style, node}) => {
    const iconStyle = {marginRight: '5px'};
    const iconName = node.children ? "folder outline" : "file outline";

    return (
        <div style={style.base}>
            <div style={style.title}>
                <Icon
                    name={iconName}
                    size="large"
                    inverted={true}
                    style={iconStyle}
                />
                {node.name}
            </div>
        </div>
    );
};

decorators.Toggle = ({style}) => {
    const {height, width} = style;
    const points = `0,0 0,${12} ${12},${7}`;

    return (
        <div style={style.base}>
            <div style={style.wrapper}>
                <svg height={height} width={width}>
                    <polygon
                        points={points}
                        style={style.arrow}
                    />
                </svg>
            </div>
        </div>
    );
};

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
                    style={customStyle}
                    decorators={decorators}
                />
            </div>
        );
    }
}
export default Tree;