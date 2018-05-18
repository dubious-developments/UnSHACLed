/**
 * Redux reducers that will be dispatch by an event fired through an action.
 * This reducer will update the 'file' field in the globar store by appending the fileObject
 * it received from the dispatcher.
 * @param state: current state of the global store
 * @param action: the dispatched action
 * @return {any} new global state
 */
export function fileReducer(state: any = [], action: any) {
    switch (action.type) {
        case 'updateOpenedFiles':
            return {
                ...state,
                files: [...state.files, action.payload.fileObject]
            }
        default :
            return state;
    }
}