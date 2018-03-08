interface DataAccessObjectInterface {
    insert(file: Blob);
    find(file: Blob);
    update(file: Blob);
}
