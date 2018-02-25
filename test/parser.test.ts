import {Parser} from "../source/persistence/parser";

describe( "Parser Class", () => {
    it("Should parse a Turtle file and return a correct RDF graph.", () => {
        let parser = new Parser();
        let uri: Uri = generateTurtleFile();
        let store = parser.parse(uri);
        console.log(store.toString());
        removeFile(uri);
    });

    it("Should parse a RDF/XML file and return a correct RDF graph.", () => {
        let parser = new Parser();
        let uri: Uri = generateRdfXmlFile();
        let store = parser.parse(uri);
        console.log(store.toString());
        removeFile(uri);
    });

    it("Should parse a N3 file and return a correct RDF graph.", () => {
        let parser = new Parser();
        let uri: Uri = generateN3File();
        let store = parser.parse(uri);
        console.log(store.toString());
        removeFile(uri);
    });
});

function generateTurtleFile() {
    let uri: Uri = new Uri("test.ttl");
    let content: string = "@prefix dc: <http://purl.org/dc/elements/1.1/>. " +
        "<http://en.wikipedia.org/wiki/Tony_Benn>" +
        'dc:title "Tony Benn";' +
        'dc:publisher "Wikipedia".';
    let result = generateFile(uri, content);
    if (result) {
        return uri;
    }
    return null;
}

function generateRdfXmlFile() {
    let uri: Uri = new Uri("test.rdf");
    let content: string = "<rdf:RDF" +
        'xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/">' +
        '<rdf:Description rdf:about="http://en.wikipedia.org/wiki/Tony_Benn">' +
        "<dc:title>Tony Benn</dc:title>" +
        "<dc:publisher>Wikipedia</dc:publisher>" +
        "</rdf:Description>\n" +
        "</rdf:RDF>";
    let result = generateFile(uri, content);
    if (result) {
        return uri;
    }
    return null;
}

function generateN3File() {
    let uri: Uri = new Uri("test.n3");
    let content: string = "@prefix dc: <http://purl.org/dc/elements/1.1/>. " +
        "<http://en.wikipedia.org/wiki/Tony_Benn>" +
        'dc:title "Tony Benn";' +
        'dc:publisher "Wikipedia".';
    let result = generateFile(uri, content);
    if (result) {
        return uri;
    }
    return null;
}

function generateFile(uri: Uri, content: string) {
    let fs = require("fs");
    fs.writeFile(uri.getUriAsString(), content, function(err) {
        if (err) {
            throw err;
        }
    });
    fs.close();
    return true;
}

function removeFile(uri: Uri) {
    let fs = require("fs");
    fs.unlink(uri.getUriAsString(), (err) => {
        if (err) {
            throw err;
        }
    });
    fs.close();
    return true;
}
