import {DataGraphModem} from "../src/persistence/dataGraphModem";

describe( "DataGraphModem Class", () => {
    it("Should parse a Turtle file and return a correct RDF graph.", () => {
        let modem = new DataGraphModem();
        modem.demodulate(generateTurtle(), "text/turtle");
        modem.modulate(modem.getData(), "text/turtle");
    });
});

function generateTurtle() {
    return "@prefix dc: <http://purl.org/dc/elements/1.1/>.\n" +
        "<http://en.wikipedia.org/wiki/Tony_Benn>\n" +
        'dc:title "Tony Benn";\n' +
        'dc:publisher "Wikipedia".';
}
