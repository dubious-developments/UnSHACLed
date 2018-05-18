/**
 * Redux action used to be dispatched to the reducers which will update the store.
 * @param fileName: name of file being opened and which should be added to the global sotre
 * @param repoName: name of the repository the file resides in
 * @param type: type of file. can either be 'SHACL' or 'data'.
 * @return {{type: string; payload: {fileObject: any}}}
 */
export function appendFile(fileName: any, repoName: any, type: any) {
    return{
        type: 'appendFile',
        payload: {
            fileName: fileName,
            repoName: repoName,
            type: type
        }
    };
}
