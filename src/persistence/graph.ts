export class Graph {
    private store: any;
    private file: Blob;

    public constructor(store: any, file: any) {
        this.store = store;
        this.file = file;
    }

    public getStore() {
        return this.store;
    }

    public getFile() {
        return this.file;
    }
}