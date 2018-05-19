import {Model} from "../entities/model";
import {LocalFileDAO} from "./localFileDAO";
import {ValidationService} from "../conformance/ValidationService";
import {RemoteFileDAO} from "./remoteFileDAO";

/**
 * This class provides access to most of the application's key components.
 */
export class DataAccessProvider {

    private static _instance: DataAccessProvider = new DataAccessProvider();
    private localFileDAO: LocalFileDAO;
    private remoteFileDAO: RemoteFileDAO;
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
     * Retrieve the local file DAO.
     * @returns {LocalFileDAO}
     */
    public getLocalFileDAO(): LocalFileDAO {
        if (this.localFileDAO) {
            return this.localFileDAO;
        } else {
            this.localFileDAO = new LocalFileDAO(this._model);
            return this.localFileDAO;
        }
    }

    /**
     * Retrieve the remote file DAO.
     * @returns {RemoteFileDAO}
     */
    public getRemoteFileDAO(): RemoteFileDAO {
        if (this.remoteFileDAO) {
            return this.remoteFileDAO;
        } else {
            this.remoteFileDAO = new RemoteFileDAO(this._model);
            return this.remoteFileDAO;
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