interface DataAccessObjectInterface {
    insert: (uri: string) => void;
    find: (uri: string) => void;
    delete: (uri: string) => void;
    update: (uri: string) => void;
}
