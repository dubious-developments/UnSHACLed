import * as React from 'react';
import * as Collections from "typescript-collections";

declare let mxClient, mxUtils, mxGraph, mxRubberband: any;

declare function require(name: string): any;
let $rdf = require('rdflib');

let dataGraph = '@prefix dash: <http://datashapes.org/dash#> .\n\
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n\
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n\
@prefix schema: <http://schema.org/> .\n\
@prefix sh: <http://www.w3.org/ns/shacl#> .\n\
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n\
\n\
schema:PersonShape\n\
    a sh:NodeShape ;\n\
    sh:targetClass schema:Person ;\n\
    sh:property [\n\
        sh:path schema:givenName ;\n\
        sh:datatype xsd:string ;\n\
        sh:name "given name" ;\n\
    ] ;\n\
    sh:property [\n\
        sh:path schema:birthDate ;\n\
        sh:lessThan schema:deathDate ;\n\
        sh:maxCount 1 ;\n\
    ] ;\n\
    sh:property [\n\
        sh:path schema:gender ;\n\
        sh:in ( "female" "male" ) ;\n\
    ] ;\n\
    sh:property [\n\
        sh:path schema:address ;\n\
        sh:node schema:AddressShape ;\n\
    ] .\n\
\n\
schema:AddressShape\n\
    a sh:NodeShape ;\n\
    sh:closed true ;\n\
    sh:property [\n\
        sh:path schema:streetAddress ;\n\
        sh:datatype xsd:string ;\n\
    ] ;\n\
    sh:property [\n\
        sh:path schema:postalCode ;\n\
        sh:or ( [ sh:datatype xsd:string ] [ sh:datatype xsd:integer ] ) ;\n\
        sh:minInclusive 10000 ;\n\
        sh:maxInclusive 99999 ;\n\
    ] .';

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

            let uri = 'https://example.org/resource.ttl';
            let mimeType = 'text/turtle';
            let store = $rdf.graph();

            try {
                $rdf.parse(dataGraph, store, uri, mimeType);

                let triples = store.statementsMatching(undefined, undefined, undefined);
                let resources = new Collections.DefaultDictionary<
                    any, Collections.DefaultDictionary<any, Array<any>>
                    >(() => new Collections.DefaultDictionary<
                    any, Array<any>
                    >(() => [],
                      (key) => key.termType + key.value),
                      (key) => key.termType + key.value);
                let topLevel = new Collections.Set<any>((item) => item.value);
                let downLevel = new Collections.Set<any>((item) => item.value);

                for (let triple of triples) {
                    resources.getValue(triple.subject).getValue(triple.predicate).push(triple.object);

                    topLevel.add(triple.subject);
                    if (triple.object.hasOwnProperty("elements")) {
                        for (let elem of triple.object.elements) {
                            downLevel.add(elem);
                        }
                    } else {
                        downLevel.add(triple.object);
                    }
                }

                topLevel.difference(downLevel);

                // let DASH = $rdf.Namespace("http://datashapes.org/dash#");
                // let RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
                // let RDFS = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#");
                // let SCHEMA = $rdf.Namespace("http://schema.org/");
                let SH = $rdf.Namespace("http://www.w3.org/ns/shacl#");
                // let XSD = $rdf.Namespace("http://www.w3.org/2001/XMLSchema#");

                // visualisation should start from the resources in topLevel,
                // since all other resources are dependant on them
                topLevel.forEach(function (resource: any) {
                    // todo visualise using `resources` to iterate triples store, type: {subject: {predicate: [object]}}
                    // for example, to get all property traits of `resource`
                    console.log(resources.getValue(resource).getValue(SH("property")));
                    // the traits of these properties can on their turn be obtained
                    // trough 'resources' in the same manner etc
                });

            } catch (err) {
                console.log(err);
            }

            // Creates the graph inside the given container
            let graph = new mxGraph(container);
            graph.panningHandler.ignoreCell = false;
            graph.setPanning(true);

            document.onkeydown = function (evt: KeyboardEvent) {
                if (evt.altKey) {
                    graph.panningHandler.ignoreCell = true;
                }
            };

            document.onkeyup = function (evt: KeyboardEvent) {
                graph.panningHandler.ignoreCell = false;
            };

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

            graph.getPreferredPageSize = function (bounds: any, width: number, height: number) {
                let pages = this.getPageLayout();
                let size = this.getPageSize();

                return new mxRectangle(0, 0, pages.width * size.width, pages.height * size.height);
            };

            /**
             * Guesses autoTranslate to avoid another repaint (see below).
             * Works if only the scale of the graph changes or if pages
             * are visible and the visible pages do not change.
             */
            let graphViewValidate = graph.view.validate;
            graph.view.validate = function () {
                if (this.graph.container !== null && mxUtils.hasScrollbars(this.graph.container)) {
                    let pad = this.graph.getPagePadding();
                    let size = this.graph.getPageSize();

                    // Updating scrollbars here causes flickering in quirks and is not needed
                    // if zoom method is always used to set the current scale on the graph.
                    this.translate.x = pad.x / this.scale - (this.x0 || 0) * size.width;
                    this.translate.y = pad.y / this.scale - (this.y0 || 0) * size.height;
                }

                graphViewValidate.apply(this, arguments);
            };

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

            // Enables rubberband selection
            new mxRubberband(graph);

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
    }

    render() {
        const grid = require('../img/grid.gif');
        return (
            <div
                id="graphContainer"
                style={{
                    backgroundImage: `url(${ grid })`,
                    cursor: 'default',
                    overflow: 'auto',
                }}
            />
        );
    }
}

export default MxGraph;