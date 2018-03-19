import {Model} from "../entities/model";
import {FileDAO} from "./fileDAO";

export class DataAccessProvider {

    private static _instance: DataAccessProvider;
    private fileDAO: FileDAO;

    // tmp field
    private _tmpModel: Model;

    private constructor() {
        // temporarily create model here
        this._tmpModel = new Model();
    }

    // tmp method
    get tmpModel(): Model {
        return this._tmpModel;
    }

    public static getInstance(): DataAccessProvider {
        return this._instance || (this._instance = new this());
    }

    public getFileDAO() {
        if (this.fileDAO) {
            return this.fileDAO;
        } else {
            return new FileDAO(this._tmpModel);
        }
    }
}