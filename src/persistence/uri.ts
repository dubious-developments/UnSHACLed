export class Uri {
    private uri: string;
    private name: string;
    public constructor(uri: string) {
        this.verify(uri);
        this.uri = uri;
        let split = uri.split("/");
        this.name = split[split.length - 1];
    }
    public getUriAsString() {
        return this.uri;
    }
    public getName() {
        return this.name;
    }
    private verify(uri: string) {
        return;
    }
}
