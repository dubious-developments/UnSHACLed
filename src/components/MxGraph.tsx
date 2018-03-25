import * as React from 'react';
declare let mxClient, mxUtils, mxGraph, mxDragSource, mxEvent, mxCell, mxGeometry, mxRubberband: any;
import { Button, Segment } from 'semantic-ui-react';
import { MxGraphProps } from './interfaces/interfaces';

class MxGraph extends React.Component<MxGraphProps, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            graph: null,
            test: "Shape",
            preview: null,
            dragElement: null
        };
        this.handleLoad = this.handleLoad.bind(this);
        this.saveGraph = this.saveGraph.bind(this);
        this.insertCell = this.insertCell.bind(this);
        this.setDragElement = this.setDragElement.bind(this);
        this.initiateDragPreview = this.initiateDragPreview.bind(this);
        this.getGraphUnderMouse = this.getGraphUnderMouse.bind(this);
        this.makeDragSource = this.makeDragSource.bind(this);
    }

    componentDidMount() {
        this.handleLoad();
    }

    componentWillReceiveProps(nextprops: any) {
        if (this.props.dragid !== nextprops.dragid) {
            const {graph} = this.state;
            console.log("Received updated props" + nextprops.dragid);
            this.setState({
                test: nextprops.dragid
            });
            console.log(graph);
            this.setDragElement(nextprops.dragid);
            var el = document.getElementById(String(nextprops.dragid));
            console.log(el);
            this.makeDragSource(el);
        }
    }

    insertCell(grph: any, evt: any, target: any, x:any, y:any) {
        const {test} = this.state;
        var cell = new mxCell(test, new mxGeometry(0, 0, 80, 30));
        cell.vertex = true;
        var cells = grph.importCells([cell], x, y, target);
        if (cells != null && cells.length > 0) {
            grph.scrollCellToVisible(cells[0]);
            grph.setSelectionCells(cells);
        }
    }

    setDragElement(dragid: string) {
        this.setState((prevState, props) => ({
            dragElement: document.getElementById(dragid)
        }));
    }
    initiateDragPreview() {
        // Creates the element that is being for the actual preview.
        var dragElt = document.createElement('div');
        dragElt.style.border = 'dashed black 1px';
        dragElt.style.width = '80px';
        dragElt.style.height = '30px';
        this.setState((prevState, props) => ({
            preview: dragElt,
        }));
    }

    getGraphUnderMouse(evt: any) {
        const {graph} = this.state;
        var x = mxEvent.getClientX(evt);
        var y = mxEvent.getClientY(evt);
        var elt = document.elementFromPoint(x, y);
        if (mxUtils.isAncestorNode(graph.container, elt)) {
            return graph;
        }
        return null;
    }
    makeDragSource(dragElement: any) {
        const {preview} = this.state;
        const {graph} = this.state;
        var ds = mxUtils.makeDraggable(
            dragElement, this.getGraphUnderMouse, this.insertCell, preview, null, null, graph.autoscroll, true
        );

        // Redirects feature to global switch. Note that this feature should only be used
        // if the the x and y arguments are used in funct to insert the cell.
        ds.isGuidesEnabled = function()
        {
            return graph.graphHandler.guidesEnabled;
        };

        // Restores original drag icon while outside of graph
        ds.createDragElement = mxDragSource.prototype.createDragElement;
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
        const did = this.props.dragid;
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

            this.initiateDragPreview();

        }
    }

    render() {
        const grid = require('../img/grid.gif');
        return (
            <div>
            <div
                id="graphContainer"
                style={{
                    backgroundImage: `url(${ grid })`,
                    cursor: 'default',
                    height: '50%'
                }}
            />
                <Button>{this.props.dragid}</Button>
            </div>
        );
    }
}

export default MxGraph;