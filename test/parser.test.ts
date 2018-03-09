import {DataGraphModem} from "../src/persistence/dataGraphModem";

describe( "DataGraphModem Class", () => {
    it("Should parse a Turtle file and return a correct RDF graph.", () => {
        let modem = new DataGraphModem();
        modem;
    });

    it("Should parse a RDF/XML file and return a correct RDF graph.", () => {
        let modem = new DataGraphModem();
        modem;
    });

    it("Should parse a N3 file and return a correct RDF graph.", () => {
        let modem = new DataGraphModem();
        modem;
    });
});

function generateTurtleFile() {
    return "@prefix dc: <http://purl.org/dc/elements/1.1/>.\n" +
        "<http://en.wikipedia.org/wiki/Tony_Benn>\n" +
        'dc:title "Tony Benn";\n' +
        'dc:publisher "Wikipedia".';
}

function generateRdfXmlFile() {
    return "<rdf:RDF\n" +
        'xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/">\n' +
        '<rdf:Description rdf:about="http://en.wikipedia.org/wiki/Tony_Benn">\n' +
        "<dc:title>Tony Benn</dc:title>\n" +
        "<dc:publisher>Wikipedia</dc:publisher>\n" +
        "</rdf:Description>\n" +
        "</rdf:RDF>";
}

function generateN3File() {
    return "@prefix dc: <http://purl.org/dc/elements/1.1/>.\n" +
        "<http://en.wikipedia.org/wiki/Tony_Benn>\n" +
        'dc:title "Tony Benn";\n' +
        'dc:publisher "Wikipedia".';
}
