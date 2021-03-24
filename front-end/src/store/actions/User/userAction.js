import * as actionNames from '../actionTypes.js'

export const addUserInfo = (load) => {
    return {
        type    : actionNames.ADD_USER_INFO,
        payload : load
    }
}
