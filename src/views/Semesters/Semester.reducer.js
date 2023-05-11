import { GET_ERRORS, BEFORE_SEMESTER, GET_SEMESTERS, DELETE_SEMESTER, UPSERT_SEMESTER } from '../../redux/types';

const initialState = {
    semesterId: null,
    semesters: null,
    pagination: null,
    deleteSemesterAuth: false,
    upsertSemesterAuth: false,
    getSemesterAuth: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case UPSERT_SEMESTER:
            return {
                ...state,
                semester: action.payload,
                upsertSemesterAuth: true
            }
        case DELETE_SEMESTER:
            return {
                ...state,
                semesterId: action.payload.semesterId,
                semesters: action.payload.semesters,
                deleteSemesterAuth: true
            }
        case GET_SEMESTERS:
            return {
                ...state,
                semesters: action.payload.semesters,
                pagination: action.payload.pagination,
                semesterStats: action.payload.semesterStats,
                getSemesterAuth: true
            }
        case BEFORE_SEMESTER:
            return {
                ...state,
                semesterId: null,
                semesters: null,
                pagination: null,
                deleteSemesterAuth: false,
                upsertSemesterAuth: false,
                getSemesterAuth: false,
            }
        default:
            return {
                ...state
            }
    }
}