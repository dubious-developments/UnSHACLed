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
    
    main(container: HTMLElement): void {
        // Checks if the browser is supported
        if (!mxClient.isBrowserSupported()) {
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
            
            this.configureStylesheet(graph);

            let shapeObject = new Shape('shape 1');
            let shape = new mxCell(shapeObject, new mxGeometry(0, 0, 200, 28), 'shape');
            shape.setVertex(true);

            let columnObject = new Property('prop1');
            let column = new mxCell(columnObject, new mxGeometry(0, 0, 0, 26));
            column.setVertex(true);
            column.setConnectable(false);
            
            let firstColumn = column.clone();
            firstColumn.value.name = 'FIRST PROPERTY';
            shape.insert(firstColumn);

            let secondColumn = column.clone();
            secondColumn.value.name = 'SECOND PROPERTY';
            shape.insert(secondColumn);

            // Returns the name field of the user object for the label
            graph.convertValueToString = function(cell: any) {
                if (cell.value != null && cell.value.name != null) {
                    return cell.value.name;
                }
                return mxGraph.prototype.convertValueToString.apply(this, arguments); // "supercall"
            };

            let superCellLabelChanged = graph.cellLabelChanged;
            graph.cellLabelChanged = function(cell: any, newValue: string, autoSize: any) {
                if (mxUtils.isNode(cell.value.name)) {
                    // Clones the value for correct undo/redo
                    let elt = cell.value.cloneNode(true);
                    elt.setAttribute('label', newValue);
                }

                superCellLabelChanged.apply(this, arguments);
            };

            graph.getLabel = function(cell: any) {
                console.log(cell);
                if (this.isHtmlLabel(cell)) {
                    return mxUtils.htmlEntities(cell.value.name);
                }
                return mxGraph.prototype.getLabel.apply(this, arguments);
            };

            // Properties are dynamically created HTML labels
            // Returns true for properties and false for shapes
            graph.isHtmlLabel = function(cell: any) {
                return !this.isSwimlane(cell) && !this.model.isEdge(cell);
            };

            let v1 = graph.getModel().cloneCell(shape);

            // Adds cells to the model in a single step
            graph.getModel().beginUpdate();
            
            try {

                v1.value.name = "First shape";
                v1.geometry.x = 20;
                v1.geometry.y = 20;

                graph.addCell(v1, parent);

                console.log(v1.geometry.width, v1.geometry.height);
                v1.geometry.alternateBounds = 
                    new mxRectangle(100, 100, v1.geometry.width + 100, v1.geometry.height + 100);

                // let _v2 = graph.insertVertex(parent, null, column, 200, 150, 80, 30);
                // let _e1 = graph.insertEdge(parent, null, '', v1, v2);
            } finally {
                // Updates the display
                graph.getModel().endUpdate();
            }

            graph.getSelectionCell(v1);
        }
    }
    
    configureStylesheet(graph: any) {
        let style = new Object();
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        style[mxConstants.STYLE_FONTCOLOR] = '#000000';
        style[mxConstants.STYLE_FONTSIZE] = '11';
        style[mxConstants.STYLE_FONTSTYLE] = 0;
        style[mxConstants.STYLE_SPACING_LEFT] = '4';
        style[mxConstants.STYLE_IMAGE_WIDTH] = '48';
        style[mxConstants.STYLE_IMAGE_HEIGHT] = '48';
        graph.getStylesheet().putDefaultVertexStyle(style);

        style = new Object();
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_FILLCOLOR] = '#A1E44D';
        style[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = '#ffffff';
        style[mxConstants.STYLE_STROKECOLOR] = '#A6E853';
        style[mxConstants.STYLE_FONTCOLOR] = '#000000';
        style[mxConstants.STYLE_STROKEWIDTH] = '1';
        style[mxConstants.STYLE_STARTSIZE] = '28';
        style[mxConstants.STYLE_FONTSIZE] = '12';
        style[mxConstants.STYLE_FONTSTYLE] = 1;
        style[mxConstants.STYLE_SHADOW] = 1;
        graph.getStylesheet().putCellStyle('shape', style);
    }
    
    render() {
        const grid = require('../img/grid.gif');
        return (
            <div 
                id="graphContainer"
                style={{
                    backgroundImage: `url(${ grid })`,
                    cursor: 'default',
                }}
            />
        );
    }
}

class Shape {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
 
    clone() {
        return mxUtils.clone(this);
    }
} 

class Property {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
 
    clone() {
        return mxUtils.clone(this);
    }
} 

export default MxGraph;