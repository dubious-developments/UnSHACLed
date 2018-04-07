/**
 * Provides basic DAO functionality (i.e. basic access to a persistence system).
 */
import {ModelComponent} from "../entities/modelTaskMetadata";

export interface DataAccessObject {
    /**
     * Load the contents of the module from the persistence system
     * (i.e. database, filesystem, CVS, ...).
     * @param {Module} module
     */
    find(module: Module): void;

    /**
     * Insert the contents of the module into the persistence system
     * (i.e. database, filesystem, CVS, ...).
     * @param {Module} module
     */
    insert(module: Module): void;
}

/**
 * A single persistence directive.
 * Contains all the necessary information to carry out a persistence operation.
 */
export interface Module {
    /**
     * Return the designated ModelComponent (used to identify a Component).
     */
    getTarget(): ModelComponent;

    /**
     * Return the identifier (used to identify a specific part of a Component).
     */
    getIdentifier(): string;

    /**
     * Return the content of the Module.
     */
    getContent(): any;

    /**
     * Returns the MIME type
     */
    getMime();
}