import * as React from 'react';
import * as Collections from 'typescript-collections';
import {ModelComponent, ModelTaskMetadata} from "../entities/modelTaskMetadata";
import {DataAccessProvider} from "../persistence/dataAccessProvider";
import {GetValidationReport, RemoveTripleComponent, VisualizeComponent} from "../services/ModelTasks";
import TimingService from "../services/TimingService";
import {ValidationReport} from "../conformance/wrapper/ValidationReport";
import {MxGraphProps} from "./interfaces/interfaces";
import {ModelObserver} from "../entities/model";
import {Graph, PrefixMap} from "../persistence/graph";
import {Task} from "../entities/task";
import {ModelData} from "../entities/modelData";

declare let mxClient, mxUtils, mxGraph, mxDragSource, mxEvent, mxCell, mxGeometry, mxRubberband, mxEditor,
    mxRectangle, mxPoint, mxConstants, mxPerimeter, mxEdgeStyle, mxStackLayout, mxCellOverlay, mxImage: any;

let $rdf = require('rdflib');

class MxGraph extends React.Component<MxGraphProps, any> {

    private nameToStandardCellDict: Collections.Dictionary<string, any>;
    private blockToCellDict: Collections.Dictionary<Block, any>;
    private subjectToBlockDict: Collections.Dictionary<string, Block>;
    private triples: Collections.Set<Triple>;

    private cellToTriples: Collections.Dictionary<any, Triple>;
    private invalidCells: Collections.Set<any>;

    private timer: TimingService;

    constructor(props: any) {
        super(props);
        this.state = {
            graph: null,
            test: "Shape",
            preview: null,
            dragElement: null,
            dragElList: ["Shape", "Node Shape", "Property Shape"],
            templateCount: 0
        };
        this.handleLoad = this.handleLoad.bind(this);
        this.saveGraph = this.saveGraph.bind(this);
        this.insertCell = this.insertCell.bind(this);
        this.setDragElement = this.setDragElement.bind(this);
        this.initiateDragPreview = this.initiateDragPreview.bind(this);
        this.getGraphUnderMouse = this.getGraphUnderMouse.bind(this);
        this.makeDragSource = this.makeDragSource.bind(this);
        this.visualizeFile = this.visualizeFile.bind(this);
        this.handleUserAction = this.handleUserAction.bind(this);
        this.addTemplate = this.addTemplate.bind(this);

        this.nameToStandardCellDict = new Collections.Dictionary<string, any>();
        this.blockToCellDict = new Collections.Dictionary<Block, any>((b) => b.name);
        this.subjectToBlockDict = new Collections.Dictionary<string, Block>();
        this.triples = new Collections.Set<Triple>((t) =>  t.subject + " " + t.predicate + " " + t.object);
        this.cellToTriples = new Collections.Dictionary<any, Triple>((c) => c.value.name);
        this.invalidCells = new Collections.Set<any>();

        this.timer = new TimingService();
    }

    componentDidMount() {
        this.handleLoad();
    }

    componentWillReceiveProps(nextprops: any) {
    }

    componentDidUpdate() {
        console.log("state adapted");
        console.log(this.state.graph);
    }

    insertCell(grph: any, evt: any, target: any, x: any, y: any) {
        const {test} = this.state;
        let cell = new mxCell(test, new mxGeometry(0, 0, 80, 30));
        cell.vertex = true;
        let cells = grph.importCells([cell], x, y, target);
        if (cells != null && cells.length > 0) {
            grph.scrollCellToVisible(cells[0]);
            grph.setSelectionCells(cells);
        }
    }

    setDragElement(dragid: string) {
        this.setState(() => ({
            dragElement: document.getElementById(dragid)
        }));
    }

    initiateDragPreview() {
        // Creates the element that is being for the actual preview.
        let dragElt = document.createElement('div');
        dragElt.style.border = 'dashed black 1px';
        dragElt.style.width = '80px';
        dragElt.style.height = '30px';
        this.setState(() => ({
            preview: dragElt,
        }));
    }

    getGraphUnderMouse(evt: any) {
        const {graph} = this.state;
        let x = mxEvent.getClientX(evt);
        let y = mxEvent.getClientY(evt);
        let elt = document.elementFromPoint(x, y);
        if (mxUtils.isAncestorNode(graph.container, elt)) {
            return graph;
        }
        return null;
    }

    makeDragSource(dragElement: any) {
        const {preview} = this.state;
        const {graph} = this.state;
        let ds = mxUtils.makeDraggable(
            dragElement, this.getGraphUnderMouse, this.insertCell, preview, null, null, graph.autoscroll, true
        );

        // Redirects feature to global switch. Note that this feature should only be used
        // if the the x and y arguments are used in funct to insert the cell.
        ds.isGuidesEnabled = function () {
            return graph.graphHandler.guidesEnabled;
        };

        // Restores original drag icon while outside of graph
        ds.createDragElement = mxDragSource.prototype.createDragElement;
    }

    handleLoad() {
        this.main(document.getElementById('graphContainer'));
    }

    saveGraph(g: any) {
        console.log(g);
        this.setState({
            graph: g
        });
    }

    handleClick() {

    }

    extendCanvas(graph: any) {
        /**
         * Specifies the size of the size for "tiles" to be used for a graph with
         * scrollbars but no visible background page. A good value is large
         * enough to reduce the number of repaints that is caused for auto-
         * translation, which depends on this value, and small enough to give
         * a small empty buffer around the graph. Default is 400x400.
         */
        graph.scrollTileSize = new mxRectangle(0, 0, 400, 400);

        /**
         * Returns the padding for pages in page view with scrollbars.
         */
        graph.getPagePadding = function () {
            return new mxPoint(
                Math.max(0, Math.round(graph.container.offsetWidth - 34)),
                Math.max(0, Math.round(graph.container.offsetHeight - 34)));
        };

        /**
         * Returns the size of the page format scaled with the page size.
         */
        graph.getPageSize = function () {
            return (this.pageVisible) ?
                new mxRectangle(
                    0, 0,
                    this.pageFormat.width * this.pageScale, this.pageFormat.height * this.pageScale)
                : this.scrollTileSize;
        };

        /**
         * Returns a rectangle describing the position and count of the
         * background pages, where x and y are the position of the top,
         * left page and width and height are the vertical and horizontal
         * page count.
         */
        graph.getPageLayout = function () {
            let size = (this.pageVisible) ? this.getPageSize() : this.scrollTileSize;
            let bounds = this.getGraphBounds();
            if (bounds.width === 0 || bounds.height === 0) {
                return new mxRectangle(0, 0, 1, 1);
            } else {
                // Computes untransformed graph bounds
                let x = Math.ceil(bounds.x / this.view.scale - this.view.translate.x);
                let y = Math.ceil(bounds.y / this.view.scale - this.view.translate.y);
                let w = Math.floor(bounds.width / this.view.scale);
                let h = Math.floor(bounds.height / this.view.scale);

                let x0 = Math.floor(x / size.width);
                let y0 = Math.floor(y / size.height);
                let w0 = Math.ceil((x + w) / size.width) - x0;
                let h0 = Math.ceil((y + h) / size.height) - y0;

                return new mxRectangle(x0, y0, w0, h0);
            }
        };

        // Fits the number of background pages to the graph
        graph.view.getBackgroundPageBounds = function () {
            let layout = this.graph.getPageLayout();
            let page = this.graph.getPageSize();

            return new mxRectangle(
                this.scale * (this.translate.x + layout.x * page.width),
                this.scale * (this.translate.y + layout.y * page.height),
                this.scale * layout.width * page.width,
                this.scale * layout.height * page.height);
        };

        graph.getPreferredPageSize = function () {
            let pages = this.getPageLayout();
            let size = this.getPageSize();

            return new mxRectangle(0, 0, pages.width * size.width, pages.height * size.height);
        };

        /**
         * THIS FUNCTION CAUSED AUTOFOCUS BUG !!!!
         */

        /*let graphViewValidate = graph.view.validate;
        graph.view.validate = function () {
            console.log("graphViewValidate");
            if (this.graph.container !== null && mxUtils.hasScrollbars(this.graph.container)) {
                let pad = this.graph.getPagePadding();
                let size = this.graph.getPageSize();

                // Updating scrollbars here causes flickering in quirks and is not needed
                // if zoom method is always used to set the current scale on the graph.
                this.translate.x = pad.x / this.scale - (this.x0 || 0) * size.width;
                this.translate.y = pad.y / this.scale - (this.y0 || 0) * size.height;
            }

            graphViewValidate.apply(this, arguments);
        };*/

        let graphSizeDidChange = graph.sizeDidChange;
        graph.sizeDidChange = function () {
            if (this.container !== null && mxUtils.hasScrollbars(this.container)) {
                let pages = this.getPageLayout();
                let pad = this.getPagePadding();
                let size = this.getPageSize();

                // Updates the minimum graph size
                let minw = Math.ceil(2 * pad.x / this.view.scale + pages.width * size.width);
                let minh = Math.ceil(2 * pad.y / this.view.scale + pages.height * size.height);

                let min = graph.minimumGraphSize;

                // LATER: Fix flicker of scrollbar size in IE quirks mode
                // after delayed call in window.resize event handler
                if (min === null || min.width !== minw || min.height !== minh) {
                    graph.minimumGraphSize = new mxRectangle(0, 0, minw, minh);
                }

                // Updates auto-translate to include padding and graph size
                let dx = pad.x / this.view.scale - pages.x * size.width;
                let dy = pad.y / this.view.scale - pages.y * size.height;

                if (!this.autoTranslate && (this.view.translate.x !== dx || this.view.translate.y !== dy)) {
                    this.autoTranslate = true;
                    this.view.x0 = pages.x;
                    this.view.y0 = pages.y;
                    // NOTE: THIS INVOKES THIS METHOD AGAIN. UNFORTUNATELY THERE IS NO WAY AROUND THIS SINCE THE
                    // BOUNDS ARE KNOWN AFTER THE VALIDATION AND SETTING THE TRANSLATE TRIGGERS A REVALIDATION.
                    // SHOULD MOVE TRANSLATE/SCALE TO VIEW.
                    let tx = graph.view.translate.x;
                    let ty = graph.view.translate.y;
                    graph.view.setTranslate(dx, dy);
                    graph.container.scrollLeft += (dx - tx) * graph.view.scale;
                    graph.container.scrollTop += (dy - ty) * graph.view.scale;
                    this.autoTranslate = false;
                    return;
                }
                graphSizeDidChange.apply(this, arguments);
            }
        };

        // Sets initial scrollbar positions
        window.setTimeout(
            function () {
                let bounds = graph.getGraphBounds();
                let width = Math.max(bounds.width, graph.scrollTileSize.width * graph.view.scale);
                let height = Math.max(bounds.height, graph.scrollTileSize.height * graph.view.scale);
                graph.container.scrollTop =
                    Math.floor(Math.max(0, bounds.y - Math.max(20, (graph.container.clientHeight - height) / 4)));
                graph.container.scrollLeft =
                    Math.floor(Math.max(0, bounds.x - Math.max(0, (graph.container.clientWidth - width) / 2)));
            },
            0
        );
    }

    /* ALT + SCROLL: zoom, ALT: panning */
    initPeripheralHandling(graph: any) {
        // // Adds mouse wheel handling for zoom
        mxEvent.addMouseWheelListener((evt, up) => {
            if (up && evt.altKey) {
                graph.zoomIn();
                mxEvent.consume(evt);
            } else if (evt.altKey) {
                graph.zoomOut();
                mxEvent.consume(evt);
            }
        });

        document.onkeydown = function (evt: KeyboardEvent) {
            if (evt.altKey) {
                graph.panningHandler.ignoreCell = true;
            }
        };

        document.onkeyup = function () {
            graph.panningHandler.ignoreCell = false;
        };

        graph.panningHandler.addListener(
            mxEvent.PAN,
            function () {
                graph.container.style.cursor = 'move';
            }
        );

        graph.panningHandler.addListener(
            mxEvent.PAN_START,
            function () {
                graph.container.style.cursor = 'move';
            }
        );

        graph.panningHandler.addListener(
            mxEvent.PAN_END,
            function () {
                graph.container.style.cursor = 'default';
            }
        );
    }

    configureCells(editor: any, graph: any) {
        editor.layoutSwimlanes = true;
        editor.createSwimlaneLayout = function () {
            let layout = new mxStackLayout(this.graph, false);
            layout.fill = true;
            layout.resizeParent = true;

            // Overrides the function to always return true
            layout.isVertexMovable = function () {
                return true;
            };

            return layout;
        };

        // Only shapes/tables are movable
        graph.isCellMovable = function (cell: any) {
            return this.isSwimlane(cell);
        };

        // Only shapes/tables are resizable, this fixes the style
        graph.isCellResizable = function (cell: any) {
            return this.isSwimlane(cell);
        };
    }

    configureLabels(graph: any) {
        // Returns the name field of the user object for the label
        graph.convertValueToString = function (cell: any) {
            if (cell.value != null && cell.value.name != null) {
                return cell.value.name;
            }
            return mxGraph.prototype.convertValueToString.apply(this, arguments); // "supercall"
        };

        let superCellLabelChanged = graph.cellLabelChanged;
        graph.cellLabelChanged = function (cell: any, newValue: string, autoSize: any) {
            if (mxUtils.isNode(cell.value.name)) {
                // Clones the value for correct undo/redo
                let elt = cell.value.cloneNode(true);
                elt.setAttribute('label', newValue);
                newValue = elt;
            }

            superCellLabelChanged.apply(this, arguments);
        };

        graph.getLabel = function (cell: any) {
            if (this.isHtmlLabel(cell)) {
                return mxUtils.htmlEntities(cell.value.name);
            }
            return mxGraph.prototype.getLabel.apply(this, arguments);
        };

        // Properties are dynamically created HTML labels
        // Returns true for properties and false for shapes
        graph.isHtmlLabel = function (cell: any) {
            return !this.isSwimlane(cell) && !this.model.isEdge(cell);
        };

    }

    configureTooltips(graph: any) {
        // Installs a custom global tooltip
        graph.setTooltips(true);
        graph.getTooltip = function(state: any) {
            let cell = state.cell;
            // If the cell is invalid, then it will have an error
            // thus display the error message, else just show the label
            if (cell.value.error) {
                return cell.value.error.toString();
            } else {
                return graph.getLabel(cell);
            }
        };
    }

    initStandardCells() {
        let blockObject = new Block();
        let block = new mxCell(blockObject, new mxGeometry(0, 0, 250, 28));
        block.setVertex(true);
        this.nameToStandardCellDict.setValue('block', block);

        let rowObject = new Row();
        let row = new mxCell(rowObject, new mxGeometry(0, 0, 0, 26), 'Row');
        row.setVertex(true);
        row.setConnectable(false);
        this.nameToStandardCellDict.setValue('row', row);
    }

    addNewRowOverlay(graph:any, cell: any) {
        // Creates a new overlay in the middle with an image and a tooltip
        let overlay = new mxCellOverlay(
            new mxImage('add.png', 24, 24), 'Add a new row', mxConstants.ALIGN_CENTER);
        overlay.cursor = 'hand';

        let model = graph.getModel();
        let instance = this;

        // Installs a handler for clicks on the overlay
        overlay.addListener(mxEvent.CLICK, function(sender: any, event: any) {
            graph.clearSelection();
            model.beginUpdate();
            try {
                let temprow = model.cloneCell(instance.nameToStandardCellDict.getValue('row'));
                temprow.value = {name: "", trait: "null"};
                let parent = cell.getParent();
                
                instance.addNewRowOverlay(graph, temprow);
                graph.removeCellOverlay(cell);
                parent.insert(temprow);
                graph.view.refresh(parent);
            } finally {
                // Updates the display
                model.endUpdate();
            }
        });

        // Sets the overlay for the cell in the graph
        graph.addCellOverlay(cell, overlay);
    }

    parseDataGraphToBlocks(persistenceGraph: any, type: string, file: string, prefixes: PrefixMap) {
        // let DASH = $rdf.Namespace("http://datashapes.org/dash#");
        let RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
        // let RDFS = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
        // let SCHEMA = $rdf.Namespace("http://schema.org/");
        let SH = $rdf.Namespace("http://www.w3.org/ns/shacl#");
        // let XSD = $rdf.Namespace("http://www.w3.org/2001/XMLSchema#");

        let triples = persistenceGraph.query(store => store).statements;
        let mutableGraph = persistenceGraph.toMutable();
        let newTriples = new Collections.Set<Triple>();

        triples.forEach((triple: any) => {
            if (!this.subjectToBlockDict.containsKey(triple.subject.value)) {
                this.subjectToBlockDict.setValue(triple.subject.value, new Block(triple.subject.value));
            }
            newTriples.add(new Triple(
                triple.subject.value, triple.predicate.value, triple.object.value, mutableGraph, type, file));
        });

        newTriples.difference(this.triples);
        this.triples.union(newTriples);

        newTriples.forEach((triple: any) => {
            let subject = triple.subject;
            let predicate = triple.predicate;
            let object = triple.object;

            let subjectBlock = this.subjectToBlockDict.getValue(subject);
            if (subjectBlock) {
                if (predicate === RDF("type").uri && object === SH("NodeShape").uri) {
                    subjectBlock.blockType = "NodeShape";
                } else if (predicate === SH("path").uri) {
                    subjectBlock.name = object;
                    subjectBlock.blockType = "Property";
                } else {
                    subjectBlock.traits.push(triple);
                }
            }
        });

        return this.subjectToBlockDict.values();
    }

    clear() {
        let {graph} = this.state;
        graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
        this.blockToCellDict.clear();
    }

    visualizeFile(persistenceGraph: any, type: string, file: string, prefixes: PrefixMap) {
        this.clear();
        let {graph} = this.state;
        let blocks = this.parseDataGraphToBlocks(persistenceGraph, type, file, prefixes);

        let model = graph.getModel();
        let parent = graph.getDefaultParent();

        blocks.forEach(b => {
            let v1 = model.cloneCell(this.nameToStandardCellDict.getValue('block'));
            v1.value = this.replacePrefixes(b.name, prefixes);
            this.blockToCellDict.setValue(b, v1);
        });

        blocks.forEach(b => {
            let v1 = this.blockToCellDict.getValue(b);
            model.beginUpdate();
            try {
                let longestname = 0;
                b.traits.forEach(trait => {
                    let temprow = model.cloneCell(this.nameToStandardCellDict.getValue('row'));
                    let name = this.replacePrefixes(trait.predicate, prefixes)
                        + " :  "
                        + this.replacePrefixes(trait.object, prefixes);
                    // let name = trait.predicate + " :  " + trait.object;
                    longestname = Math.max(name.length, longestname);
                    temprow.value = {name: name, trait: trait};
                    v1.insert(temprow);

                    this.addNewRowOverlay(graph, v1);

                    this.cellToTriples.setValue(temprow, trait);

                    let b2 = this.subjectToBlockDict.getValue(trait.object);
                    if (b2) {
                        let v2 = this.blockToCellDict.getValue(b2);
                        graph.insertEdge(graph.getDefaultParent(), null, '', temprow, v2);
                    }
                });

                if (b.blockType === undefined) {
                    b.blockType = "Data";
                }
                v1.style = b.blockType;
                v1.geometry.width += longestname * 4;
                v1.geometry.alternateBounds = new mxRectangle(0, 0, v1.geometry.width, v1.geometry.height);
                graph.addCell(v1, parent);
            } finally {
                model.endUpdate();
            }
        });

        let layout = new mxStackLayout(graph, false, 35);
        layout.execute(graph.getDefaultParent());
    }

    /**
     * Replaces prefixes where possible in the string s
     * @param {string} s
     * @param {PrefixMap} prefixes
     */
    replacePrefixes(s: string, prefixes: PrefixMap): string {
        Object.keys(prefixes).forEach(key => {
            s = s.replace(prefixes[key], key + ":");
        });
        return s;
    }

    configureStylesheet(graph: any) {
        let style = {};
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

        style = {};
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_FILLCOLOR] = '#135589';
        style[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = '#ffffff';
        style[mxConstants.STYLE_STROKECOLOR] = '#135589';
        style[mxConstants.STYLE_FONTCOLOR] = '#000000';
        style[mxConstants.STYLE_STROKEWIDTH] = '1';
        style[mxConstants.STYLE_STARTSIZE] = '28';
        style[mxConstants.STYLE_FONTSIZE] = '12';
        style[mxConstants.STYLE_FONTSTYLE] = 1;
        style[mxConstants.STYLE_SHADOW] = 1;
        graph.getStylesheet().putCellStyle('NodeShape', style);

        style = {};
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_FILLCOLOR] = '#2A93D5';
        style[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = '#ffffff';
        style[mxConstants.STYLE_STROKECOLOR] = '#2A93D5';
        style[mxConstants.STYLE_FONTCOLOR] = '#000000';
        style[mxConstants.STYLE_STROKEWIDTH] = '1';
        style[mxConstants.STYLE_STARTSIZE] = '28';
        style[mxConstants.STYLE_FONTSIZE] = '12';
        style[mxConstants.STYLE_FONTSTYLE] = 1;
        style[mxConstants.STYLE_SHADOW] = 1;
        graph.getStylesheet().putCellStyle('Property', style);

        style = {};
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_FILLCOLOR] = '#A1E44D';
        style[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = '#ffffff';
        style[mxConstants.STYLE_STROKECOLOR] = '#A1E44D';
        style[mxConstants.STYLE_FONTCOLOR] = '#000000';
        style[mxConstants.STYLE_STROKEWIDTH] = '1';
        style[mxConstants.STYLE_STARTSIZE] = '28';
        style[mxConstants.STYLE_FONTSIZE] = '12';
        style[mxConstants.STYLE_FONTSTYLE] = 1;
        style[mxConstants.STYLE_SHADOW] = 1;
        graph.getStylesheet().putCellStyle('Data', style);

        style = {};
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_FILLCOLOR] = '#C10000';
        style[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = '#ffffff';
        style[mxConstants.STYLE_STROKECOLOR] = '#C10000';
        style[mxConstants.STYLE_FONTCOLOR] = '#000000';
        style[mxConstants.STYLE_STROKEWIDTH] = '1';
        style[mxConstants.STYLE_STARTSIZE] = '28';
        style[mxConstants.STYLE_FONTSIZE] = '12';
        style[mxConstants.STYLE_FONTSTYLE] = 1;
        style[mxConstants.STYLE_SHADOW] = 1;
        graph.getStylesheet().putCellStyle('InvalidBlock', style);

        style = {};
        style[mxConstants.STYLE_STROKEWIDTH] = '1';
        style[mxConstants.STYLE_STROKECOLOR] = '#A1E44D';
        graph.getStylesheet().putCellStyle('Row', style);

        style = {};
        style[mxConstants.STYLE_STROKEWIDTH] = '1';
        style[mxConstants.STYLE_STROKECOLOR] = '#C10000';
        graph.getStylesheet().putCellStyle('InvalidRow', style);

        style = graph.stylesheet.getDefaultEdgeStyle();
        style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#FFFFFF';
        style[mxConstants.STYLE_STROKEWIDTH] = '2';
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
    }

    initToolBar(editor: any) {
        /* Toolbar functionality */
        this.addToolbarButton(editor, toolbar, 'delete', '', 'delete');
        this.addToolbarButton(editor, toolbar, 'undo', '', 'undo');
        this.addToolbarButton(editor, toolbar, 'redo', '', 'redo');
        this.addToolbarButton(editor, toolbar, 'show', '', 'camera');
        this.addToolbarButton(editor, toolbar, 'zoomIn', '+', 'zoom in');
        this.addToolbarButton(editor, toolbar, 'zoomOut', '-', 'zoom out');
        this.addToolbarButton(editor, toolbar, 'actualSize', '', 'actual size');
        this.addToolbarButton(editor, toolbar, 'fit', '', 'fit');
        /* Dropdown File toolbar */
        /* Dropdown Edit toolbar */
        this.addToolbarButton(editor, toolbar, 'undo', '', 'tb_undo');
        this.addToolbarButton(editor, toolbar, 'redo', '', 'tb_redo');
        this.addToolbarButton(editor, toolbar, 'delete', '', 'tb_delete');
        this.addToolbarButton(editor, toolbar, 'copy', '', 'tb_copy');
        this.addToolbarButton(editor, toolbar, 'paste', '', 'tb_paste');
        this.addToolbarButton(editor, toolbar, 'selectAll', '', 'tb_all');
        this.addToolbarButton(editor, toolbar, 'selectNone', '', 'tb_none');
        /* Dropdown View toolbar */
        this.addToolbarButton(editor, toolbar, 'show', '', 'tb_show');
        this.addToolbarButton(editor, toolbar, 'zoomIn', '', 'tb_zoomin');
        this.addToolbarButton(editor, toolbar, 'zoomOut', '', 'tb_zoomout');
        this.addToolbarButton(editor, toolbar, 'actualSize', '', 'tb_actual');
        this.addToolbarButton(editor, toolbar, 'fit', '', 'tb_fit');
    }

    addToolbarButton(editor: any, toolbar: any, action: any, label: any, id: any) {
        let button = document.getElementById(String(id));
        mxEvent.addListener(button, 'click', function () {
            editor.execute(action);
        });
        mxUtils.write(button, label);
    }

    initDragAndDrop(graph: any) {
        let sidebar = document.getElementById("sideBarID");
        for (let id of this.state.dragElList) {
            this.addDraggableElement(graph, sidebar, id);
        }
    }

    addDraggableElement(graph: any, sidebar: any, id: any) {
        // Function that is executed when the image is dropped on
        // the graph. The cell argument points to the cell under
        // the mousepointer if there is one.
        let model = graph.getModel();
        let block = this.nameToStandardCellDict.getValue('block');
        let row = this.nameToStandardCellDict.getValue('row');
        let funct = function (g: any, evt: any, target: any, x: any, y: any) {
            let v1 = model.cloneCell(block);
            let parent = graph.getDefaultParent();
            /* Set correct styling based on input */
            let style = 'NodeShape';
            if (id.indexOf('Property') >= 0) {
                style = 'Property';
            }
            /* Create empty block */
            let b = new Block();
            b.name = "new " + id;
            b.blockType = style;

            /* Create empty row */
            let temprow = model.cloneCell(row);
            temprow.value = {name: "", trait: "null"};
            b.traits = [temprow];

            model.beginUpdate();
            try {
                v1.insert(temprow);
                v1.value = b.name;
                v1.style = style;
                v1.geometry.x = x;
                v1.geometry.y = y;
                v1.geometry.width += 10 * 4;
                graph.addCell(v1, parent);
                v1.geometry.alternateBounds =
                    new mxRectangle(0, 0, v1.geometry.width, v1.geometry.height);
            } finally {
                // Updates the display
                model.endUpdate();
            }
            graph.setSelectionCell(v1);
        };

        // Creates the compoent which is used as the draggabmle element (drag source)
        let comp = document.getElementById(String(id));
        /* Create draggable element */
        let ds = mxUtils.makeDraggable(comp, graph, funct);
        ds.isGuidesEnabled = function () {
            return graph.graphHandler.guidesEnabled;
        };

        // Restores original drag icon while outside of graph
        ds.createDragElement = mxDragSource.prototype.createDragElement;
    }

    addTemplate() {
        let {graph} = this.state;
        let {templateCount} = this.state;
        // TODO prevent multiple cell selection
        // TODO positioning??

        if (!graph.isSelectionEmpty()) {
            // Creates a copy of the selection array to preserve its state
            var cells = graph.getSelectionCells();
            // var bounds = graph.getView().getBounds(cells);
            console.log(cells);
            console.log(cells[0].value);
            let cellname;

            // handle multiple cell selection
            if (cells.length === 1) {
                // handle non-block/block cells differently
                if (typeof (cells[0].value) === "string") {
                    cellname = cells[0].value;
                } else {
                    cellname = cells[0].value.name.split("/").pop();
                    console.log(cells[0]);
                    // set all block clear all block values
                    cells[0].value.traits = [];
                }
            } else {
                cellname = "Multiple components";
            }

            // Function that is executed when the image is dropped on
            // the graph. The cell argument points to the cell under
            // the mousepointer if there is one.
            var funct = function (gr: any, evt: any, target: any, x: any, y: any, cell: any) {
                gr.setSelectionCells(gr.importCells(cells, x, y, cell));
            };
            // create sidebar entry
            // invoke callback on parent component, which will add entry to sidebar
            this.props.callback(cellname, templateCount);
            // increment state counter
            this.setState({
                templateCount: templateCount + 1
            });
            // let preview = null;
            var drag = document.getElementById(cellname + templateCount);
            mxUtils.makeDraggable(drag, graph, funct);
            this.props.setLabel(false);
        } else {
            console.log("nothing is selected");
            this.props.setLabel(true);
        }

    }

    main(container: HTMLElement | null): void {
        // Checks if the browser is supported
        if (!container) {
            mxUtils.error('Could not find \'graphContainer\'', 200, false);
        } else if (!mxClient.isBrowserSupported()) {
            mxUtils.error('Browser is not supported!', 200, false);
        } else {

            let model = DataAccessProvider.getInstance().model;
            model.registerObserver(new ModelObserver((changeBuf) => {
                let tasks = new Array<Task<ModelData, ModelTaskMetadata>>();
                changeBuf.forEach((key) => {
                    if (key === ModelComponent.DataGraph) { // data graph has changed
                        tasks.push(new VisualizeComponent(ModelComponent.DataGraph, this));
                    }

                    if (key === ModelComponent.SHACLShapesGraph) { // shapes graph has changed
                        tasks.push(new VisualizeComponent(ModelComponent.SHACLShapesGraph, this));
                    }
                });
                return tasks;
            }));

            // listen to all click events and key pressed events to check if user is actively editing
            document.addEventListener("click", this.handleUserAction, true);
            document.addEventListener("keypress", this.handleUserAction, true);

            let editor = new mxEditor();

            // Creates the graph inside the given container
            editor.setGraphContainer(container);
            let graph = editor.graph;

            // Set keyboard short cuts
            let kbsc = require('./config/keyhandler-minimal.xml');
            let config = mxUtils.load(kbsc).
            getDocumentElement();
            editor.configure(config);

            // Enable Panning
            graph.panningHandler.ignoreCell = false;
            graph.setPanning(true);

            this.extendCanvas(graph);
            new mxRubberband(graph); // Enables rubberband selection
            this.initPeripheralHandling(graph);
            this.configureStylesheet(graph);
            this.configureCells(editor, graph);
            this.configureLabels(graph);
            this.configureTooltips(graph);
            this.initStandardCells();
            this.saveGraph(graph);
            this.initiateDragPreview();
            this.initDragAndDrop(graph);
            this.initToolBar(editor);
            container.focus();

            // Get add template button
            var d2 = document.getElementById("addTemplate");
            if (d2) {
                d2.onclick = this.addTemplate;
            }
          
            graph.addListener(mxEvent.CELLS_REMOVED, (sender: any, evt: any) => {
                let cells = evt.getProperty("cells");

                for (let i = 0; i < cells.length; i++) {
                    let triple = this.cellToTriples.getValue(cells[i]);
                    if (triple) {
                        this.removeTripleFromBlocks(triple);
                        this.triples.remove(triple);
                        this.cellToTriples.remove(cells[i]);

                        let mutableGraph = triple.mutableGraph;
                        mutableGraph.removeTriple(triple.subject, triple.predicate, triple.object);

                        model.tasks.schedule(new RemoveTripleComponent(triple));
                        model.tasks.processAllTasks();
                    }
                }
            });

        }
    }
    
    public handleConformance(report: ValidationReport) {
        let invalidCellsToErrorDict = new Collections.DefaultDictionary<any, any>(() => []);
        // The keys function of a dictionary returns an array instead of a set, so keep an extra set aswell
        let incInvalidCells = new Collections.Set<any>(); 
        if (!report.isConforming()) {
            for (let error of report.getValidationErrors()) {
                let block = this.subjectToBlockDict.getValue(error.getDataElement());
                if (block) {
                    let cell = this.blockToCellDict.getValue(block);
                    invalidCellsToErrorDict.getValue(cell).push(error); 
                    incInvalidCells.add(cell);
                } else {
                    console.log(
                        "Error: could not find block for data element: " + error.getDataElement().toString() +
                        "for the conformance error");
                }
            }
        }
        invalidCellsToErrorDict.forEach((cell, errors) => this.turnCellInvalid(cell, errors));

        this.invalidCells.difference(incInvalidCells);
        // In invalidCells are now the cells that are no longer invalid
        this.invalidCells.forEach(cell => {
            this.turnCellValid(cell);
        });

        this.invalidCells = incInvalidCells;
    }

    turnCellInvalid(cell: any, errors: any[]) {
        let graph = this.state.graph;
        let model = graph.getModel();
        model.beginUpdate();
        try {
            // Set style of block
            cell.setStyle("InvalidBlock");

            // Set style of rows
            cell.children.forEach(rowCell => {
                let found = false;
                for (let error of errors) {
                    if (error.getShapeProperty() === rowCell.value.trait.predicate) {
                        rowCell.setStyle("InvalidRow");
                        rowCell.value.error = error;

                        found = true;
                        break;
                    }
                }

                if (!found) {
                    rowCell.setStyle("Row");
                    rowCell.value.error = null;
                }
            });
        } finally {
            // Updates the display
            model.endUpdate();
            graph.refresh();
        }
    }

    removeTripleFromBlocks(triple: Triple) {
        this.blockToCellDict.forEach(block => {
            block.traits = block.traits.filter(item => item !== triple);
        });

        this.subjectToBlockDict.forEach((subject: string, block: Block) => {
            block.traits = block.traits.filter(item => item !== triple);
        });
    }

    turnCellValid(cell: any) {
        let graph = this.state.graph;
        let model = graph.getModel();
        model.beginUpdate();
        try {
            // Set style of block
            cell.setStyle(cell.value.blockType);

            // Set style of rows
            cell.children.forEach(rowCell => {
                rowCell.setStyle("Row");
                rowCell.value.error = null;
            });
        } finally {
            // Updates the display
            model.endUpdate();
            graph.refresh();
        }
    }

    /**
     * Used for checking if user is actively editing or not
     */
    handleUserAction(event: any) {
        let model = DataAccessProvider.getInstance().model;

        // little hack to pass this to a callback
        let self = this;

        // notify that a user action took place
        this.timer.userAction(function(this: MxGraph) {
            model.tasks.schedule(new GetValidationReport(self));
            model.tasks.processAllTasks();
        });
    }

    render() {
        const grid = require('../img/grid.gif');
        return (
            <div
                id="graphContainer"
                style={{
                    backgroundImage: `url(${ grid })`,
                    cursor: 'default',
                    height: '100%',
                    overflow: 'auto',
                }}
            />
        );
    }
}

class Block {
    public traits: Array<Triple>;
    public blockType: string;
    public name: string;

    constructor(name?: string) {
        this.name = name || "";
        this.traits = [];
    }

    clone() {
        return mxUtils.clone(this);
    }
}

export class Triple {
    public subject: string;
    public predicate: string;
    public object: string;
    public mutableGraph: Graph;
    public type: string;
    public file: string;

    constructor(subject: string, predicate: string, object: string, mutableGraph: Graph, type: string, file: string) {
        this.subject = subject;
        this.predicate = predicate;
        this.object = object;
        this.mutableGraph = mutableGraph;
        this.type = type;
        this.file = file;
    }

    toString(): string {
        return this.subject + " " + this.predicate + " " + this.object;
    }
}

class Row {
    name: string;

    clone() {
        return mxUtils.clone(this);
    }
}

export default MxGraph;
