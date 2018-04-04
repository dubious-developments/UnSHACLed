import {Model} from "../entities/model";
import {FileDAO} from "./fileDAO";

export class DataAccessProvider {

    private static _instance: DataAccessProvider = new DataAccessProvider();
    private fileDAO: FileDAO;

    // tmp field
    private _model: Model;

    private constructor() {
        // temporarily create model here
        this._model = new Model();
    }

    // tmp method
    get model(): Model {
        return this._model;
    }

    public static getInstance(): DataAccessProvider {
        return this._instance;
    }

    public getFileDAO() {
        if (this.fileDAO) {
            return this.fileDAO;
        } else {
            return new FileDAO(this._model);
        }
    }
}