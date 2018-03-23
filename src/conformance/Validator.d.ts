import {ModelData} from "../entities/model";

interface Validator {
    getTypesForValidation();
    validate(data: ModelData);
}