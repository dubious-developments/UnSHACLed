import * as React from 'react';
import * as Collections from 'typescript-collections';
import {ModelComponent, ModelTaskMetadata} from "../entities/modelTaskMetadata";
import {DataAccessProvider} from "../persistence/dataAccessProvider";
import {EditTriple, GetValidationReport, SaveRemoteFileTask, VisualizeComponent} from "../services/ModelTasks";
import {ValidationReport} from "../conformance/ValidationReport";
import {MxGraphProps} from "./interfaces/interfaces";
import {ModelObserver} from "../entities/model";
import {Task} from "../entities/task";
import {ModelData} from "../entities/modelData";
import IdleUserDetection from "../services/IdleUserDetection";
import RequestModule from '../requests/RequestModule';
import {connect} from 'react-redux';
import {ImmutableGraph, Graph, PrefixMap} from "../persistence/graph";
import LockModal from "../modals/LockModal";
import {appendLock, flushLocks} from "../redux/actions/lockActions";

declare let mxClient, mxUtils, mxGraph, mxDragSource, mxEvent, mxCell, mxGeometry, mxRubberband, mxEditor,
    mxRectangle, mxPoint, mxConstants, mxPerimeter, mxEdgeStyle, mxStackLayout, mxCellOverlay, mxImage,
    mxGraphModel: any;

let $rdf = require('rdflib');

class MxGraph extends React.Component<MxGraphProps & any, any> {

    private nameToStandardCellDict: Collections.Dictionary<string, any>;
    private blockToCellDict: Collections.Dictionary<Block, any>;
    private subjectToBlockDict: Collections.Dictionary<string, Block>;
    private triples: Collections.Set<Triple>;

    private fileToGraphDict: Collections.Dictionary<string, ImmutableGraph>;
    private fileToTypeDict: Collections.Dictionary<string, string>;
    private fileToPrefixesDict: Collections.Dictionary<string, PrefixMap>;

    private cellToTriples: Collections.Dictionary<any, Triple>;
    private invalidCells: Collections.Set<any>;
    private grantedLockCellsDict: Collections.DefaultDictionary<any, boolean>;

    private timer: IdleUserDetection;
    private timerLocks: IdleUserDetection;

    private RDF: any = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
    private SH: any = $rdf.Namespace("http://www.w3.org/ns/shacl#");
    private SCHEMA: any = $rdf.Namespace("http://schema.org/");
    private EX: any = $rdf.Namespace("http://example.com/ns#");
    private addedShapesFile: string = "addedShapes.ttl";
    private addedDataFile: string = "addedData.ttl";

    constructor(props: any) {
        super(props);
        this.state = {
            graph: null,
            test: "Shape",
            preview: null,
            dragElement: null,
            dragElList: ["Shape", "Node Shape", "Property Shape"],
            templateCount: 0,
            showLockModal: false
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
        this.triples = new Collections.Set<Triple>((t) => t.subject + " " + t.predicate + " " + t.object);
        this.cellToTriples = new Collections.Dictionary<any, Triple>((c) => c.getId());
        this.invalidCells = new Collections.Set<any>();
        this.grantedLockCellsDict = new Collections.DefaultDictionary<any, boolean>(() => false);

        this.fileToGraphDict = new Collections.Dictionary<string, ImmutableGraph>();
        this.fileToTypeDict = new Collections.Dictionary<string, string>();
        this.fileToPrefixesDict = new Collections.Dictionary<string, PrefixMap>();

        // timer for conformance
        this.timer = new IdleUserDetection(2000);
        // timer for lock release
        this.timerLocks = new IdleUserDetection(10000);

        this.initEditFiles();
    }

    initEditFiles() {
        let prefixes: PrefixMap = {};
        prefixes.rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
        prefixes.sh = "http://www.w3.org/ns/shacl#";
        prefixes.schema = "http://schema.org/";
        prefixes.ex = "http://example.com/ns#";
        prefixes.rdfs = "http://www.w3.org/2000/01/rdf-schema#";
        prefixes.xsd = "http://www.w3.org/2001/XMLSchema#";

        let addedShapes = ImmutableGraph.create();
        addedShapes = addedShapes.addPrefixes(prefixes);
        this.fileToGraphDict.setValue(this.addedShapesFile, addedShapes);
        this.fileToPrefixesDict.setValue(this.addedShapesFile, prefixes);
        this.fileToTypeDict.setValue(this.addedShapesFile, "SHACLShapesGraph");

        let addedData = ImmutableGraph.create();
        addedData = addedData.addPrefixes(prefixes);
        this.fileToGraphDict.setValue(this.addedDataFile, addedData);
        this.fileToPrefixesDict.setValue(this.addedDataFile, prefixes);
        this.fileToTypeDict.setValue(this.addedDataFile, "DataGraph");
    }

    componentDidMount() {
        this.handleLoad();
        window.addEventListener('beforeunload', this.leaveAlert);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.leaveAlert);
    }

    leaveAlert(e: any) {
        const c = '';
        e.returnValue = c;
        return c;
    }

    componentWillReceiveProps(nextprops: any) {
    }

    /* componentDidUpdate() {
        console.log("state adapted");
        console.log(this.state.graph);
    } */

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
        this.setState({
            graph: g
        });
    }

    /**
     * Handles clicks anywhere on the canvas.
     * If clicked on a node/cell, originating from a GitHub file, then a lock gets requested.
     * @param graph: graph object.
     */
    handleClick(graph: any) {
        let instance = this;
        graph.addListener(
            mxEvent.CLICK,
            function (sender: any, evt: any) {
                let cell = evt.getProperty('cell');

                if (cell != null) {
                    // Request lock if clicked on GitHub file

                    let triple;
                    if (cell.getChildCount() > 0) {
                        triple = instance.cellToTriples.getValue(cell.getChildAt(0));
                    } else {
                        triple = instance.cellToTriples.getValue(cell);
                    }

                    let filename;
                    if (triple) {
                        filename = triple.file;
                    } else {
                        console.log("Error: no triple found for the cell", cell);
                        return;
                    }

                    // Checks if it is a GitHub file
                    let repo = instance.getRepoFromFile(filename);
                    if (repo) {
                        // Check if user has lock
                        RequestModule.hasLock(
                            RequestModule.getRepoOwnerFromFile(filename, instance.props.files.content),
                            repo,
                            instance.props.token,
                            filename
                        ).then(lockGranted => {
                            console.log("User has lock: ", lockGranted);
                            // If user does not have a lock yet, send a lock request
                            if (!lockGranted) {
                                console.log("Don't have one, so requesting a lock for" + filename);
                                RequestModule.requestLock(
                                    RequestModule.getRepoOwnerFromFile(filename, instance.props.files.content),
                                    repo,
                                    instance.props.token,
                                    filename
                                ).then(lock => {
                                    // add lock to global store

                                    console.log(instance.props.locks);
                                    instance.processLock(cell, filename, lock);
                                });
                            }
                        });
                    } else {
                        instance.grantedLockCellsDict.setValue(cell, true);
                    }
                }
                evt.consume();
            }
        );
    }

    /**
     * Gets the repository belonging to the file
     * @param filename: string value.
     * @returns {string}, Returns either the name of the repository or '' if none found.
     */
    getRepoFromFile(filename: string): string {
        for (let file of this.props.files.content) {
            if (file.name === filename) {
                return file.repo;
            }
        }
        return '';
    }

    /**
     * Processes the lock after the lock request.
     * TODO.
     * @param cell: cell the user clicked on.
     * @param filename: name of the file for which the lock got granted.
     * @param lock: true means that the lock got assigned to the user, false means the opposite.
     */
    processLock(cell: any, filename: string, lock: boolean) {
        if (lock) {
            // add lock to global store
            this.props.appendLock(filename);
            this.grantedLockCellsDict.setValue(cell, true);
            console.log("Lock granted");
            console.log(this.props.locks);
        } else {
            this.setState({showLockModal: true});
        }
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

        // todo add rows should also be disabled
        graph.isCellEditable = (cell: any) => {
            return this.grantedLockCellsDict.containsKey(cell);
        };
    }

    configureLabels(graph: any) {
        // Returns the name field of the user object for the label
        graph.convertValueToString = function (cell: any) {
            if (cell.value != null && cell.value.name != null) {
                return cell.value.name;
            }
            // "supercall"
            return mxGraph.prototype.convertValueToString.apply(this, arguments);
        };

        // let superCellLabelChanged = graph.cellLabelChanged;
        // graph.cellLabelChanged = function (cell: any, newValue: string, autoSize: any) {
        //     console.log(cell, newValue);
        //     // if (cell.value) {
        //     //     // Clones the value for correct undo/redo
        //     //     // let elt = mxUtils.clone(cell.value);
        //     //     let elt = cell.value.clone();
        //     //     elt.setAttribute('name', newValue);
        //     //     newValue = elt;
        //     // }

        //     superCellLabelChanged.apply(this, arguments);
        // };

        graph.getLabel = function (cell: any) {
            if (this.isHtmlLabel(cell)) {
                return mxUtils.htmlEntities(cell.value.name);
            }
            return mxGraph.prototype.getLabel.apply(this, arguments);
        };

        let instance = this;
        // Text label changes will go into the name field of the user object
        graph.model.valueForCellChanged = function(cell: any, value: any) {
            let reject = false;
            let triple = instance.cellToTriples.getValue(cell);
            if (triple && cell.style === "Row") {
                let [predicate, object] =
                    instance.traitRestFromName(value, instance.fileToPrefixesDict.getValue(triple.file));

                // Reject changes that do not conform to the syntax of a row value
                if (predicate && object) {
                    let newTriple = new Triple(triple.subject, predicate, object, triple.file);
                    newTriple.cell = triple.cell;
                    instance.editTriple(cell, triple, newTriple);
                } else {
                    reject = true;
                }
            } else {
                instance.editBlock(cell, value);
            }

            if (value.name != null) {
                return mxGraphModel.prototype.valueForCellChanged.apply(this, arguments);
            } else {
                let old = cell.value.name;
                if (reject) {
                    cell.value.name = old;
                } else {
                    cell.value.name = value;
                }
                return old;
            }
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
        graph.getTooltip = function (state: any) {
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

    addNewRowOverlay(graph: any, cell: any) {
        // Creates a new overlay in the middle with an image and a tooltip
        let overlay = new mxCellOverlay(
            new mxImage('img/add.png', 24, 24), 'Add a new row', mxConstants.ALIGN_CENTER);
        overlay.cursor = 'hand';

        let model = graph.getModel();
        let instance = this;

        // Installs a handler for clicks on the overlay
        overlay.addListener(mxEvent.CLICK, function (sender: any, event: any) {
            let temprow = model.cloneCell(instance.nameToStandardCellDict.getValue('row'));
            let block, file, triple;

            graph.clearSelection();
            model.beginUpdate();
            try {
                block = instance.subjectToBlockDict.getValue(event.properties.cell.value.realName);
                if (block) {
                    if (block.traits.length > 0) {
                        file = block.traits[0].file;
                    } else {
                        file = block.triple.file || instance.addedDataFile;
                    }

                    triple = new Triple(block.realName, "predicate", "object", file);
                    triple.cell = temprow;
                    temprow.value.name = instance.nameFromTrait(triple);

                    cell.insert(temprow);
                }
            } finally {
                // Updates the display
                model.endUpdate();
                graph.refresh();
            }

            if (triple) {
                // start an update task in the model
                let oldGraph = instance.fileToGraphDict.getValue(file);
                let type = instance.fileToTypeDict.getValue(file);
                if (oldGraph && type) {
                    let backendModel = DataAccessProvider.getInstance().model;
                    let newGraph = oldGraph.addTriple(triple.subject, triple.predicate, triple.object);
                    instance.fileToGraphDict.setValue(file, newGraph);
                    backendModel.tasks.schedule(new EditTriple(
                        newGraph, type, file)
                    );
                    // TODO remove this after testing
                    backendModel.tasks.processAllTasks();
                } else {
                    console.log("error: graph or type undefined");
                }

                // update the data structures
                instance.triples.add(triple);
                instance.cellToTriples.setValue(temprow, triple);
                if (block) {
                    block.traits.push(triple);
                } else {
                    console.log("error: could not find block: " + block.realName);
                }
            }
        });

        // Sets the overlay for the cell in the graph
        graph.addCellOverlay(cell, overlay);
    }

    parseDataGraphToBlocks(persistenceGraph: any, file: string) {
        let triples = persistenceGraph.query(store => store).statements;
        this.fileToGraphDict.setValue(file, persistenceGraph);
        let newTriples = new Collections.Set<Triple>();

        triples.forEach((triple: any) => {
            if (!this.subjectToBlockDict.containsKey(triple.subject.value)) {
                this.subjectToBlockDict.setValue(triple.subject.value, new Block(triple.subject.value));
            }
            newTriples.add(new Triple(
                triple.subject.value, triple.predicate.value, triple.object.value, file));
        });

        newTriples.difference(this.triples);
        this.triples.union(newTriples);

        newTriples.forEach((triple: any) => {
            let subject = triple.subject;
            let predicate = triple.predicate;
            let object = triple.object;

            let subjectBlock = this.subjectToBlockDict.getValue(subject);
            if (subjectBlock) {
                if (predicate === this.RDF("type").uri && object === this.SH("NodeShape").uri) {
                    subjectBlock.blockType = "NodeShape";
                    subjectBlock.triple = triple;
                } else if (predicate === this.SH("path").uri) {
                    subjectBlock.name = object;
                    subjectBlock.realName = subject;
                    subjectBlock.blockType = "Property";
                    subjectBlock.triple = triple;
                } else {
                    subjectBlock.traits.push(triple);
                }
            }
        });

        return this.subjectToBlockDict.values();
    }

    clearVisualisation() {
        this.blockToCellDict.clear();
        this.cellToTriples.clear();
        let {graph} = this.state;
        graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
    }

    clear() {
        this.blockToCellDict.clear();
        this.subjectToBlockDict.clear();
        this.triples.clear();
        this.fileToGraphDict.clear();
        this.fileToTypeDict.clear();
        this.fileToPrefixesDict.clear();
        this.cellToTriples.clear();
        this.invalidCells.clear();
        this.initEditFiles();

        let {graph} = this.state;
        graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
    }

    visualizeFile(persistenceGraph: any, type: string, file: string, prefixes: PrefixMap) {
        if (this.fileToGraphDict.containsKey(file)) {
            return;
        }

        let blocks = this.parseDataGraphToBlocks(persistenceGraph, file);

        this.clearVisualisation();
        let {graph} = this.state;
        this.fileToTypeDict.setValue(file, type);
        this.fileToPrefixesDict.setValue(file, prefixes);

        let model = graph.getModel();
        let parent = graph.getDefaultParent();

        blocks.forEach(b => {
            b.name = this.placePrefixes(b.name, prefixes);
            let v1 = model.cloneCell(this.nameToStandardCellDict.getValue('block'));
            v1.value.name = b.name;
            v1.value.realName = b.realName;
            this.blockToCellDict.setValue(b, v1);
        });

        blocks.forEach(b => {
            let blockCell = this.blockToCellDict.getValue(b);
            model.beginUpdate();
            let rows: any[] = []; // store rows temporarily, since they only get an id after the model updates
            try {
                let longestname = 0;
                b.traits.forEach(trait => {
                    let rowCell = model.cloneCell(this.nameToStandardCellDict.getValue('row'));
                    let name = this.nameFromTrait(trait, prefixes);

                    longestname = Math.max(name.length, longestname);
                    rowCell.value.name = name;
                    blockCell.insert(rowCell);

                    let b2 = this.subjectToBlockDict.getValue(trait.object);
                    if (b2) {
                        let v2 = this.blockToCellDict.getValue(b2);
                        graph.insertEdge(graph.getDefaultParent(), null, '', rowCell, v2);
                    }
                    rows.push(rowCell);
                });

                this.addNewRowOverlay(graph, blockCell);

                if (!b.blockType) {
                    b.blockType = "Data";
                }

                blockCell.value.blockType = b.blockType;
                blockCell.style = b.blockType;
                blockCell.geometry.width += longestname * 4;
                blockCell.geometry.alternateBounds =
                    new mxRectangle(0, 0, blockCell.geometry.width, blockCell.geometry.height);
                graph.addCell(blockCell, parent);
            } finally {
                model.endUpdate();
            }

            for (let i = 0; i < rows.length; i++) {
                this.cellToTriples.setValue(rows[i], b.traits[i]);
                b.traits[i].cell = rows[i];
            }

            if (b.triple) {
                this.cellToTriples.setValue(blockCell, b.triple);
                b.triple.cell = blockCell;
            }
        });

        let layout = new mxStackLayout(graph, false, 35);
        layout.execute(graph.getDefaultParent());
    }

    /**
     * Get the name for a row based on trait
     */
    nameFromTrait(trait: any, prefixes?: PrefixMap) {
        if (prefixes) {
            return this.placePrefixes(trait.predicate, prefixes)
                + " :  "
                + this.placePrefixes(trait.object, prefixes);
        } else {
            return trait.predicate + " : " + trait.object;
        }
    }

    /**
     * Get the predicate and object of a trait for a row based on a name
     */
    traitRestFromName(name: string, prefixes?: PrefixMap) {
        if (prefixes) {
            name = this.replacePrefixes(name, prefixes);
        }
        return name.split(' : ');
    }

    /**
     * Places prefixes where possible in the string s
     * @param {string} s
     * @param {PrefixMap} prefixes
     */
    placePrefixes(s: string, prefixes: PrefixMap): string {
        Object.keys(prefixes).forEach(key => {
            s = s.replace(prefixes[key], key + ":");
        });
        return s;
    }

    /**
     * Replaces the prefixes where possible in the string with the full values
     * @param {string} s
     * @param {PrefixMap} prefixes
     */
    replacePrefixes(s: string, prefixes: PrefixMap): string {
        Object.keys(prefixes).forEach(key => {
            s = s.replace(key + ":", prefixes[key]);
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
        /* Defines new editor action*/
        // Defines a new export action
        editor.addAction('cleargraph', () => {
            this.clearVisualisation();
        });
        /* Toolbar functionality */
        this.addToolbarButton(editor, toolbar, 'delete', '', 'delete');
        this.addToolbarButton(editor, toolbar, 'undo', '', 'undo');
        this.addToolbarButton(editor, toolbar, 'redo', '', 'redo');
        this.addToolbarButton(editor, toolbar, 'show', '', 'camera');
        this.addToolbarButton(editor, toolbar, 'zoomIn', '+', 'zoom in');
        this.addToolbarButton(editor, toolbar, 'zoomOut', '-', 'zoom out');
        this.addToolbarButton(editor, toolbar, 'fit', '', 'fit');
        /* Dropdown File toolbar */
        this.addToolbarButton(editor, toolbar, 'cleargraph', '', 'tb_clear_graph');
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
        // let row = this.nameToStandardCellDict.getValue('row');

        let funct = (g: any, evt: any, target: any, x: any, y: any) => {
            let v1 = model.cloneCell(block);
            let parent = graph.getDefaultParent();

            /* Create empty block */
            let b = v1.getValue();

            /* Set correct styling based on input */
            let realName = this.SCHEMA("NewShape").uri;
            let name = this.placePrefixes(realName, this.fileToPrefixesDict.getValue(this.addedShapesFile) || {});
            let style = 'NodeShape';
            let triple = new Triple(realName, this.RDF("type").uri, this.SH("NodeShape").uri, this.addedShapesFile);
            triple.cell = v1;
            if (id.indexOf('Property') >= 0) {
                realName = "_:b" + (Math.floor(Math.random() * 1000000000) + 1000);
                name = this.placePrefixes(
                    this.EX("name").uri, this.fileToPrefixesDict.getValue(this.addedShapesFile) || {}
                );
                triple = new Triple(realName, this.SH("path").uri, name, this.addedShapesFile);
                style = 'Property';
            }
            b.blockType = style;
            b.realName = realName;
            b.name = name;
            b.triple = triple;
            this.addBlock(b, v1, this.addedShapesFile);

            b.traits = [];

            model.beginUpdate();
            try {
                v1.style = style;
                v1.geometry.x = x;
                v1.geometry.y = y;
                v1.geometry.width += 10 * 4;
                graph.addCell(v1, parent);
                v1.geometry.alternateBounds =
                    new mxRectangle(0, 0, v1.geometry.width, v1.geometry.height);
                this.addNewRowOverlay(graph, v1);
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

    addBlock(b: any, cell: any, file: string) {
        this.blockToCellDict.setValue(b, cell);
        this.subjectToBlockDict.setValue(b.realName, b);

        if (b.triple) {
            this.triples.add(b.triple);
            this.cellToTriples.setValue(cell, b.triple);

            let oldGraph = this.fileToGraphDict.getValue(file);
            let type = this.fileToTypeDict.getValue(file);

            if (oldGraph && type) {
                let newGraph = oldGraph.addTriple(b.triple.subject, b.triple.predicate, b.triple.object);
                this.fileToGraphDict.setValue(
                    file,
                    newGraph
                );

                let horse = DataAccessProvider.getInstance().model;
                horse.tasks.schedule(new EditTriple(
                    newGraph, type, file)
                );

                horse.tasks.processAllTasks();
            }
        }

    }

    addTemplate() {
        let {graph} = this.state;
        let {templateCount} = this.state;
        // TODO: prevent multiple cell selection
        // TODO: positioning??

        if (!graph.isSelectionEmpty()) {
            // Creates a copy of the selection array to preserve its state
            var cells = graph.getSelectionCells();
            // var bounds = graph.getView().getBounds(cells);
            let cellname;

            // handle multiple cell selection
            if (cells.length === 1) {
                // handle non-block/block cells differently
                if (typeof (cells[0].value) === "string") {
                    cellname = cells[0].value;
                } else {
                    cellname = cells[0].value.name.split("/").pop();
                    // set all block clear all block values
                    cells[0].value.traits = [];
                }
            } else {
                cellname = "Multiple components";
            }

            // Function that is executed when the image is dropped on
            // the graph. The cell argument points to the cell under
            // the mousepointer if there is one.
            var funct = (gr: any, evt: any, target: any, x: any, y: any, cell: any) => {
                gr.setSelectionCells(gr.importCells(cells, x, y, cell));

                for (let c of cells) {
                    let block = c.value;
                    let file = this.addedDataFile;
                    if (block.blockType === "NodeShape") {
                        block.triple = new Triple(
                            block.realName, this.RDF("type").uri, this.SH("NodeShape").uri, this.addedShapesFile
                        );
                        file = this.addedShapesFile;
                    } else if (block.blockType === "Property") {
                        block.triple = new Triple(
                            block.realName, this.SH("path").uri, name, this.addedShapesFile
                        );
                        file = this.addedShapesFile;
                    }

                    this.addBlock(block, c, file);

                    for (let row of c.children) {
                        let tripleString = this.traitRestFromName(
                            row.value.name, this.fileToPrefixesDict.getValue(file)
                        );
                        let triple = new Triple(block.realName, tripleString[0].trim(), tripleString[1].trim(), file);
                        triple.cell = row;

                        block.traits.push(triple);
                        this.triples.add(triple);
                        this.cellToTriples.setValue(row, triple);

                        let oldGraph = this.fileToGraphDict.getValue(file);
                        let type = this.fileToTypeDict.getValue(file);
                        if (oldGraph && type) {
                            let horse = DataAccessProvider.getInstance().model;
                            let newGraph = oldGraph.addTriple(triple.subject, triple.predicate, triple.object);
                            this.fileToGraphDict.setValue(file, newGraph);
                            horse.tasks.schedule(new EditTriple(
                                newGraph, type, file)
                            );
                            horse.tasks.processAllTasks();
                        }
                    }
                }

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
                    // only listen to IO, mgxgraph handles the other changes
                    if (key === ModelComponent.IO) {
                        // TODO only one task with both
                        tasks.push(new VisualizeComponent(ModelComponent.DataGraph, this));
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
            let config = mxUtils.load(kbsc).getDocumentElement();
            editor.configure(config);

            // Enable Panning
            graph.panningHandler.ignoreCell = false;
            graph.setPanning(true);
            
            // Edge configurations
            graph.setCellsDisconnectable(false);
            graph.setAllowDanglingEdges(false);

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
            this.handleClick(graph);
            container.focus();

            // Get add template button
            var d2 = document.getElementById("addTemplate");
            if (d2) {
                d2.onclick = this.addTemplate;
            }

            graph.addListener(mxEvent.CELLS_REMOVED, (sender: any, evt: any) => {
                let cells = evt.getProperty("cells");

                for (let i = 0; i < cells.length; i++) {
                    let cell = cells[i];
                    let triple = this.cellToTriples.getValue(cell);

                    if (triple && cell.style === "Row") {
                        // a row was removed
                        this.removeTriple(triple, model);
                    } else if (this.blockToCellDict.containsKey(cell.value)) {
                        // a block was removed
                        let block = this.subjectToBlockDict.getValue(cell.value.realName);
                        if (block) {
                            if (block.triple) {
                                // block is a property or shape, not data
                                this.removeTriple(block.triple, model);
                            }

                            for (let trait of block.traits) {
                                this.removeTriple(trait, model);
                            }

                            this.subjectToBlockDict.remove(block.realName);
                            this.blockToCellDict.remove(block);
                        }
                    }
                }
            });
        }
    }

    debug() {
        console.log(this.blockToCellDict);
        console.log(this.subjectToBlockDict);
        console.log(this.triples);
        console.log(this.cellToTriples);
    }

    removeTriple(triple: Triple, model: any) {
        this.removeTripleFromBlocks(triple);
        this.triples.remove(triple);
        this.cellToTriples.remove(triple.cell);

        this.removeTripleFromModel(triple, model);
    }

    removeTripleFromModel(triple: Triple, model: any) {
        let oldGraph = this.fileToGraphDict.getValue(triple.file);
        let type = this.fileToTypeDict.getValue(triple.file);

        if (oldGraph && type) {
            let newGraph = oldGraph.removeTriple(triple.subject, triple.predicate, triple.object);
            this.fileToGraphDict.setValue(
                triple.file,
                newGraph
            );

            model.tasks.schedule(new EditTriple(
                newGraph, type, triple.file)
            );

            model.tasks.processAllTasks();
        }
    }

    editTriple(cell: any, oldTriple: Triple, newTriple: Triple) {
        let model = DataAccessProvider.getInstance().model;

        // Update data structures
        this.triples.remove(oldTriple);
        this.triples.add(newTriple);
        this.cellToTriples.setValue(cell, newTriple);

        // Update subjectToBlockDict by first removing the old triple
        this.removeTripleFromBlocks(oldTriple);
        // And then adding the new one
        let block = this.subjectToBlockDict.getValue(newTriple.subject);
        if (block) {
            // Dynamically update the values in this.subjectToBlockDict & this.blockToCellDict
            block.traits.push(newTriple);
        }

        // Edit triple in the model
        let oldGraph = this.fileToGraphDict.getValue(newTriple.file);
        let file = this.fileToTypeDict.getValue(newTriple.file);

        if (oldGraph && file) {
            // Use param object to adhere to interface of the backend graph structure
            let param = {nSubject: newTriple.subject, nPredicate: newTriple.predicate, nObject: newTriple.object};
            let newGraph = oldGraph.updateTriple(oldTriple.subject, oldTriple.predicate, oldTriple.object, param);

            this.fileToGraphDict.setValue(
                newTriple.file,
                newGraph
            );

            model.tasks.schedule(new EditTriple(
                newGraph, file, newTriple.file)
            );

            model.tasks.processAllTasks();
        }
    }

    editBlock(cell: any, value: string) {
        let block = cell.getValue();
        let oldSubject = block.realName;
        let subject: string = value; // This value should get replaced with the full version in the next if block

        let storedBlock = this.subjectToBlockDict.getValue(oldSubject);
        if (storedBlock) {
            let filename = storedBlock.traits[0].file;
            let prefixMap = this.fileToPrefixesDict.getValue(filename);
            if (prefixMap) {
                subject = this.replacePrefixes(value, prefixMap);
                block.realName = subject;

                this.blockToCellDict.remove(storedBlock);
                this.blockToCellDict.setValue(block, cell);
            } else {
                console.log("Could not find PrefixMap for cell + file.", cell, filename);
            }
        } else {
            console.log("No stored block found for cell", cell);
        }

        this.subjectToBlockDict.remove(oldSubject);
        this.subjectToBlockDict.setValue(subject, block);

        let trait = this.cellToTriples.getValue(cell);
        if (trait) {
            // Special kind of triple
            let newTrait;
            if (block.blockType === "NodeShape") {
                newTrait = new Triple(subject, trait.predicate, trait.object, trait.file);
            } else {
                newTrait = new Triple(trait.subject, trait.predicate, subject, trait.file);
            }
            newTrait.cell = cell;
            this.editTriple(cell, trait, newTrait);
        }

        // if block has children
        if (cell.children) {
            for (let child of cell.children) {
                trait = this.cellToTriples.getValue(child);
                if (trait) {
                    let newTrait = new Triple(subject, trait.predicate, trait.object, trait.file);
                    newTrait.cell = child;
                    this.editTriple(child, trait, newTrait);
                } else {
                    console.log("Error: edited cell has no linked triple");
                }
            }
        }

        this.addEdges(cell, subject);
    }

    /**
     * Add edges to the particular cell.
     * @param cell: cell object where the edges have to point to.
     */
     addEdges(cell: any, subject: string) {
        let graph = this.state.graph;
        let model = graph.getModel();

        // First remove all existing edges
        for (let index = 0; index < cell.getEdgeCount(); index++) {
            let edge = cell.getEdgeAt(index);
            let isOutgoing = edge.source === cell;

            model.beginUpdate();
            try {
                cell.removeEdge(edge, isOutgoing);
            } finally {
                // Updates the display
                model.endUpdate();
                graph.refresh();
            }
        }

        // Add all cells that have a triple with same predicate as subject
        let edgeCells: any[] = [];
        this.cellToTriples.forEach((c, trip) => {
            if (trip.object === subject) {
                edgeCells.push(c);
            }
        });

        // Draw the edges
        edgeCells.forEach(element => {
            model.beginUpdate();
            try {
                graph.insertEdge(graph.getDefaultParent(), null, '', element, cell);
            } finally {
                // Updates the display
                model.endUpdate();
                graph.refresh();
            } 
        });
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
                    if (rowCell.value.trait &&
                        rowCell.value.trait.predicate === error.getShapeProperty()) {
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
            cell.setStyle(cell.getValue().blockType);

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
        this.timer.userAction(function (this: MxGraph) {
            model.tasks.schedule(new GetValidationReport(self));
            // process all tasks when idle
            model.tasks.processAllTasks();
        });

        this.timerLocks.userAction(function (this: MxGraph) {
            console.log("saving all changes and releasing all locks");

            // Send changes of remote files and thus release the locks
            for (let item of self.props.locks.content) {
                console.log("Sending changes for " + item);
                model.tasks.schedule(
                    new SaveRemoteFileTask(
                        [ModelComponent.DataGraph, ModelComponent.SHACLShapesGraph],
                        item.name,
                        RequestModule.getRepoOwnerFromFile(item.name, self.props.files.content),
                        self.getRepoFromFile(item.name),
                        self.props.token
                    )
                );
            }
            self.props.flushLocks();
            model.tasks.processAllTasks();
        });
    }

    render() {
        if (this.state.showLockModal) {
            setTimeout(() => {
                this.setState({showLockModal: false});
            }, 2000);
        }

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
            >
                <LockModal
                    open={this.state.showLockModal}
                />
            </div>
        );
    }
}

class Block {
    public traits: Array<Triple>;
    public blockType: string;
    public name: string;
    public triple: Triple;
    public realName: string;

    constructor(name?: string) {
        this.name = name || "";
        this.realName = name || "";
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
    public file: string;
    public cell: any;
    private id: string;

    constructor(subject: string, predicate: string, object: string, file: string) {
        this.subject = subject;
        this.predicate = predicate;
        this.object = object;
        this.file = file;
        this.id = Guid.newGuid();
    }

    toString(): string {
        return this.subject + " " + this.predicate + " " + this.object + " " + this.file + " " + this.id;
    }
}

class Row {
    name: string;
    error: any;

    constructor(name?: string) {
        this.name = name || "";
    }

    clone() {
        return mxUtils.clone(this);
    }
}

/**
 * Map global store to props of this component.
 * @param state: state retrieved from the global redux store.
 * @returns {{token}}: sets props.token
 */
const mapStateToProps = (state, props) => {
    return {
        token: state.token,
        user: state.login,
        files: state.files,
        locks: state.locks
    };
};

/**
 * Map redux actions to props of this component. A method call to the props function
 * will automatically dispatch the action through redux without an explicit
 * dispatch call to the global store
 */
const mapActionsToProps = {
    appendLock: appendLock,
    flushLocks: flushLocks,

};

class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: any) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export default connect(mapStateToProps, mapActionsToProps)(MxGraph);