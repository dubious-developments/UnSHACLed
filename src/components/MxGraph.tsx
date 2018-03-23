import * as React from 'react';
declare let mxClient, mxUtils, mxGraph, mxRubberband: any;

class MxGraph extends React.Component<any, any> {
    constructor(props: string) {
        super(props);
        this.handleLoad = this.handleLoad.bind(this);
    }

    componentDidMount() {
        this.handleLoad();
    }

    handleLoad() {
        this.main(document.getElementById('graphContainer'));
    }

    main(container: HTMLElement | null): void {
        // Checks if the browser is supported
        if (!container) {
            mxUtils.error('Could not find \'graphContainer\'', 200, false);
        } else if (!mxClient.isBrowserSupported()) {
            mxUtils.error('Browser is not supported!', 200, false);
        } else {
            // Creates the graph inside the given container
            let graph = new mxGraph(container);
            
            // Enables rubberband selection
            // tslint:disable-next-line:no-unused-expression
            new mxRubberband(graph);
            
            // Gets the default parent for inserting new cells. This
            // is normally the first child of the root (ie. layer 0).
            let parent = graph.getDefaultParent();
            
            // Adds cells to the model in a single step
            graph.getModel().beginUpdate();
            
            try {
                let v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
                let v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
                let _e1 = graph.insertEdge(parent, null, '', v1, v2);
            } finally {
                // Updates the display
                graph.getModel().endUpdate();
            }
        }
    }

    render() {
        const grid = require('../img/grid.gif');
        return (
            <div 
                id="graphContainer"
                style={{
                    backgroundImage: `url(${ grid })`,
                    cursor: 'default',
                    height: '100%'
                }}
            />
        );
    }
}

export default MxGraph;