import {Model} from "../entities/model";
import {FileDAO} from "./fileDAO";
import {ValidationService} from "../conformance/ValidationService";

export class DataAccessProvider {

    private static _instance: DataAccessProvider = new DataAccessProvider();
    private fileDAO: FileDAO;
    private validationService: ValidationService;

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
            this.fileDAO = new FileDAO(this._model);
            return this.fileDAO;
        }
    }

    public getValidationService() {
        if (this.validationService) {
            return this.validationService;
        } else {
            this.validationService = new ValidationService(this._model);
            return this.validationService;
        }
    }
}