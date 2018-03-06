import {Parser} from "../src/persistence/parser";
import {Uri} from "../src/persistence/uri";
import {Writer} from "../src/persistence/writer";

describe( "Parser Class", () => {
    it("Should parse a Turtle file and return a correct RDF graph.", () => {
        let parser = new Parser();
        let uri: Uri = generateTurtleFile();
        let store = parser.parse(uri);
        console.log(store.toString());
    });

    it("Should parse a RDF/XML file and return a correct RDF graph.", () => {
        let parser = new Parser();
        let uri: Uri = generateRdfXmlFile();
        let store = parser.parse(uri);
        console.log(store.toString());
    });

    it("Should parse a N3 file and return a correct RDF graph.", () => {
        let parser = new Parser();
        let uri: Uri = generateN3File();
        let store = parser.parse(uri);
        console.log(store.toString());
    });
});

function generateTurtleFile() {
    let uri: Uri = new Uri("test.ttl");
    let content: string = "@prefix dc: <http://purl.org/dc/elements/1.1/>.\n" +
        "<http://en.wikipedia.org/wiki/Tony_Benn>\n" +
        'dc:title "Tony Benn";\n' +
        'dc:publisher "Wikipedia".';
    (new Writer()).write(uri, content);
    return uri;
}

function generateRdfXmlFile() {
    let uri: Uri = new Uri("test.rdf");
    let content: string = "<rdf:RDF\n" +
        'xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/">\n' +
        '<rdf:Description rdf:about="http://en.wikipedia.org/wiki/Tony_Benn">\n' +
        "<dc:title>Tony Benn</dc:title>\n" +
        "<dc:publisher>Wikipedia</dc:publisher>\n" +
        "</rdf:Description>\n" +
        "</rdf:RDF>";
    (new Writer()).write(uri, content);
    return uri;
}

function generateN3File() {
    let uri: Uri = new Uri("test.n3");
    let content: string = "@prefix dc: <http://purl.org/dc/elements/1.1/>.\n" +
        "<http://en.wikipedia.org/wiki/Tony_Benn>\n" +
        'dc:title "Tony Benn";\n' +
        'dc:publisher "Wikipedia".';
    (new Writer()).write(uri, content);
    return uri;
}
