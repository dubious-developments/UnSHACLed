import * as React from 'react';
declare let mxClient, mxUtils, mxGraph, mxDragSource, mxEvent, mxCell, mxGeometry, mxRubberband: any;
import { Button, Segment } from 'semantic-ui-react';

class MxGraph extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            graph: null,
        };
        this.handleLoad = this.handleLoad.bind(this);
        this.saveGraph = this.saveGraph.bind(this);
    }

    componentDidMount() {
        this.handleLoad();
    }

    handleLoad() {
        this.main(document.getElementById('graphContainer'));
    }

    saveGraph(g: {}) {
      this.setState((prevState, props) => ({
          graph: g,
      }));
    }

    handleClick() {
    }

    main(container: HTMLElement | null): void {
        const { test } = this.state;
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
            // save graph into state
            console.log(graph);
            this.saveGraph(graph);
            try {
                let v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
                let v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
                let _e1 = graph.insertEdge(parent, null, '', v1, v2);
            } finally {
                // Updates the display
                graph.getModel().endUpdate();
            }

            // Returns the graph under the mouse
            var graphF = function(evt:any)
            {
                var x = mxEvent.getClientX(evt);
                var y = mxEvent.getClientY(evt);
                var elt = document.elementFromPoint(x, y);
                if (mxUtils.isAncestorNode(graph.container, elt)) {
                    return graph;
                }
                return null;
            };

            // Inserts a cell at the given location
            var funct = function(grph: any, evt: any, target: any, x:any, y:any)
            {
                var cell = new mxCell("Shape", new mxGeometry(0, 0, 80, 30));
                cell.vertex = true;
                var cells = grph.importCells([cell], x, y, target);
                if (cells != null && cells.length > 0) {
                    grph.scrollCellToVisible(cells[0]);
                    grph.setSelectionCells(cells);
                }
            };

            // Creates a DOM node that acts as the drag source
            var img = document.getElementById("SHACL 0");

            // Creates the element that is being for the actual preview.
            var dragElt = document.createElement('div');
            dragElt.style.border = 'dashed black 1px';
            dragElt.style.width = '80px';
            dragElt.style.height = '30px';

            // Drag source is configured to use dragElt for preview and as drag icon
            // if scalePreview (last) argument is true. Dx and dy are null to force
            // the use of the defaults. Note that dx and dy are only used for the
            // drag icon but not for the preview.
            var ds = mxUtils.makeDraggable(img, graphF, funct, dragElt, null, null, graph.autoscroll, true);

            // Redirects feature to global switch. Note that this feature should only be used
            // if the the x and y arguments are used in funct to insert the cell.
            ds.isGuidesEnabled = function()
            {
                return graph.graphHandler.guidesEnabled;
            };

            // Restores original drag icon while outside of graph
            ds.createDragElement = mxDragSource.prototype.createDragElement;

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
                    height: '50%'
                }}
            />
        );
    }
}

export default MxGraph;