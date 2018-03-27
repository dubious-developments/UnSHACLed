/**
 * Provides basic DAO functionality (i.e. basic access to a persistence system).
 */
interface DataAccessObject {
    /**
     * Load the contents of the module from the persistence system
     * (i.e. database, filesystem, CVS, ...).
     * @param {Module} module
     */
    find(module: Module);

    /**
     * Insert the contents of the module into the persistence system
     * (i.e. database, filesystem, CVS, ...).
     * @param {Module} module
     */
    insert(module: Module);
}

/**
 * A single persistence directive.
 * Contains all the necessary information to carry out a persistence operation.
 */
interface Module {
    /**
     * Return the designated ModelComponent (used to identify a Component).
     */
    getType();

    /**
     * Return the identifier (used to identify a specific part of a Component).
     */
    getName();

    /**
     * Return the persistent target of the Module.
     */
    getTarget();
}