/**
 * Redux action used to be dispatched to the reducers which will update the store.
 * A fileObject is a typescript object consisting of a file name and the repository name the file belongs to
 * @param fileObject
 * @return {{type: string; payload: {fileObject: any}}}
 */
export function appendFile(fileObject: any) {
    return{
        type: 'appendFile',
        payload: {
            fileObject
        }
    };
}
