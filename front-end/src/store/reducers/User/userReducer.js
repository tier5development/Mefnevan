import * as actionNames from '../../actions/actionTypes'


const initialState = {
    payload: {
        userInfo: {}
    }
}



const addUserInfo = (state, action) => {
    return {

        payload: {
            ...state.payload,
            userInfo: action.payload
        }
    }
}


const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionNames.ADD_USER_INFO:
            return addUserInfo(state, action)
        default:
            return state
    }
}

export default userReducer