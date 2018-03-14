interface DataAccessObject {
    find(module: Module);
    insert(module: Module);
}

interface Module {
    getType();
    getName();
    getTarget();
}