import {Uri} from "./uri";

export class Writer {
    // contains mappings from extension to internet media type
    private formats: { [ext: string]: string; };
    public constructor() {
        let ext: string;
        this.formats = {};
        this.formats[ext = "n3"] = "text/n3";
        this.formats[ext = "rdf"] = "application/rdf+xml";
        this.formats[ext = "ttl"] = "text/turtle";
    }
    public write(uri: Uri, content: string) {
        let splitUri: string[] = uri.getUriAsString().split(".");
        let ext: string = splitUri[splitUri.length.valueOf() - 1];
        let FileSaver = require("file-saver");
        let file = new File([content], uri.getUriAsString(), {type: this.formats[ext]});
        FileSaver.saveAs(file, uri.getUriAsString());
    }
}
