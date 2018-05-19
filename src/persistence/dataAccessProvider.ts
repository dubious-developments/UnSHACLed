import {Model} from "../entities/model";
import {FileDAO} from "./fileDAO";
import {ValidationService} from "../conformance/ValidationService";

/**
 * This class provides access to most of the application's key components.
 */
export class DataAccessProvider {

    private static _instance: DataAccessProvider = new DataAccessProvider();
    private fileDAO: FileDAO;
    private validationService: ValidationService;

    // tmp field
    private _model: Model;

    /**
     * Create a new Data Access Provider.
     */
    private constructor() {
        // temporarily create model here
        this._model = new Model();

        // This can not be 'lazy initialized' since the registering of observers happens in the constructor
        this.validationService = new ValidationService(this._model);
    }

    /**
     * Retrieve the model.
     * @returns {Model}
     */
    get model(): Model {
        return this._model;
    }

    /**
     * Retrieve an instance of this data access provider.
     * @returns {DataAccessProvider}
     */
    public static getInstance(): DataAccessProvider {
        return this._instance;
    }

    /**
     * Retrieve the file DAO.
     * @returns {FileDAO}
     */
    public getFileDAO(): FileDAO {
        if (this.fileDAO) {
            return this.fileDAO;
        } else {
            this.fileDAO = new FileDAO(this._model);
            return this.fileDAO;
        }
    }

    /**
     * Retrieve the validation service.
     * @returns {ValidationService}
     */
    public getValidationService(): ValidationService {
        return this.validationService;
    }

}