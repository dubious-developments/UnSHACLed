import {Model} from "../entities/model";
import {FileDAO} from "./fileDAO";
import {ValidationService} from "../conformance/ValidationService";
import TimingService from "../services/TimingService";

export class DataAccessProvider {

    private static _instance: DataAccessProvider = new DataAccessProvider();
    private fileDAO: FileDAO;
    private validationService: ValidationService;
    private timingService: TimingService;

    // tmp field
    private _model: Model;

    private constructor() {
        // temporarily create model here
        this._model = new Model();

        this.timingService = new TimingService();

        // This can not be 'lazy initialized' since the registering of observers happens in the constructor
        this.validationService = new ValidationService(this._model);
    }

    // tmp method
    get model(): Model {
        return this._model;
    }

    public static getInstance(): DataAccessProvider {
        return this._instance;
    }

    public getFileDAO(): FileDAO {
        if (this.fileDAO) {
            return this.fileDAO;
        } else {
            this.fileDAO = new FileDAO(this._model);
            return this.fileDAO;
        }
    }

    public getValidationService(): ValidationService {
        return this.validationService;
    }


    public getTimingService(): TimingService {
        return this.timingService;
    }
}