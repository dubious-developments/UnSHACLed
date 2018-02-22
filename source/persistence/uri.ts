class Uri {
    private uri: string;
    public constructor(uri: string) {
        this.verify(uri);
        this.uri = uri;
    }
    public getUriAsString() {
        return this.uri;
    }
    private verify(uri: string) {
        return;
    }
}
