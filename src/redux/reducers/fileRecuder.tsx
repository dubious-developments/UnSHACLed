const initialState = {
    content: []
};

/**
 * Redux reducers that will be dispatch by an event fired through an action.
 * This reducer will update the 'file' field in the globar store by appending the fileObject
 * it received from the dispatcher.
 * @param state: current state of the global store
 * @param action: the dispatched action
 * @return {any} new global state
 */
export function fileReducer(state: any = initialState, action: any) {
    switch (action.type) {
        case 'appendFile':
            return Object.assign({}, state, {
                content: [
                    ...state.content,
                    {
                        name: action.payload.fileName,
                        repo: action.payload.repoName,
                        type: action.payload.type,
                    }
                ]
            });
        default :
            return state;
    }
}