import * as Collections from "typescript-collections";

export class Component {
    private map: Collections.Dictionary<string, any>;

    public getPart(key: string) {
        return this.map.getValue(key);
    }

    public setPart(key: string, value: any) {
        this.map.setValue(key, value);
    }
}