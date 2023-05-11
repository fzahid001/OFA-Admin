import { BEFORE_APPLICATION, GET_APPLCIATIONS } from '../../redux/types';

const initialState = {
    applications: null,
    getApplicationsAuth: null,
    pagination: null
}

export default function (state = initialState, action) {
    switch (action.type) {
       case GET_APPLCIATIONS:
            return {
                ...state,
                applications: action.payload.applications,
                getApplicationsAuth:true,
                pagination: action.payload.pagination
            }
        case BEFORE_APPLICATION:
            return {
                ...state, 
                applications: null,
                getApplicationsAuth: null,
                pagination: null
            }
        default:
            return {
                ...state
            }
    }
}