const initialState = {
    content: []
};

/**
 * Redux reducers that will be dispatch by an event fired through an action.
 * This reducer will update the 'locks' field in the global store by either
 * adding a lock for a filename to the 'locks' list or flush all locks that
 * were acquired. The 'locks' list, is a list of file names for which a lock
 * has been acquired.
 * @param state: current state of the global store
 * @param action: the dispatched action
 * @return {any} new global state
 */
export function lockReducer(state: any = initialState, action: any) {
    switch (action.type) {
        case 'appendLock':
            return {
                content: [
                    ...state.content,
                    {
                        name: action.payload.fileName,
                    }
                ]
            };
        case 'flushLocks':
            return [];
        default :
            return state;
    }
}