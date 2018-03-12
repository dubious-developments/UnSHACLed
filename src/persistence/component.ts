import * as Collections from "typescript-collections";

export class Component {
    private parts: Collections.Dictionary<string, any>;

    public constructor() {
        this.parts = new Collections.Dictionary<string, any>();
    }

    public getPart(key: string) {
        return this.parts.getValue(key);
    }

    public setPart(key: string, value: any) {
        this.parts.setValue(key, value);
    }
}