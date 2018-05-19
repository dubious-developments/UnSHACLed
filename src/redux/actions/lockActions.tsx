/**
 * Redux action used to be dispatched to the reducers which will update the store.
 * @param fileName: name of file being on which a lock has been acquired.
 * @return {{type: string; payload: {fileObject: any}}}
 */
export function appendLock(fileName: any) {
    return {
        type: 'appendLock',
        payload: {
            fileName: fileName,
        }
    };
}

/**
 * Redux action to be dispatched to the reducers which will update the store.
 * This action will flush the current locks associated with a user in the global
 * state (redux store). Done when all locks are released
 * @param none:
 * @return {{type: string}}
 */
export function flushLocks() {
    return{
        type: 'flushLocks'
    };
}