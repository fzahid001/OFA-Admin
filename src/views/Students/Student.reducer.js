import { BEFORE_STUDENT, GET_All_STUDENTS, GET_STUDENTS, UPSERT_STUDENT, DELETE_STUDENT, STUDENT_VERIFICATION } from '../../redux/types';

const initialState = {
    studentId: null,
    students: null,
    pagination: null,
    deleteStudentAuth: false,
    upsertStudentAuth: false,
    upsertAddressAuth: false,
    getStudentAuth: false,
    getStudentPDFAuth: false,
    getStudentOrdersPDFAuth: false,
    getStudentInvoicesPDFAuth: false,
    getStudentZipAuth:false,
    getStudentCartsPDFAuth:false,
    getVatAuth: false,
    verificationAuth: false,
    studentStats: null,
    Vat: null,
    students_: null,
    getAllStudentAuth: false,
    zip: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case UPSERT_STUDENT:
            return {
                ...state,
                student: action.payload,
                upsertStudentAuth: true
            }
        case GET_All_STUDENTS:
            return {
                ...state,
                students_: action.payload.students,
                getAllStudentAuth: true
            }
        case DELETE_STUDENT:
            return {
                ...state,
                studentId: action.payload.studentId,
                students: action.payload.students,
                deleteStudentAuth: true
            }
        case GET_STUDENTS:
            return {
                ...state,
                students: action.payload.students,
                pagination: action.payload.pagination,
                studentStats: action.payload.studentStats,
                getStudentAuth: true
            }
       
        case STUDENT_VERIFICATION:
            return {
                ...state,
                verificationAuth: true,
            }
        case BEFORE_STUDENT:
            return {
                ...state,
                student: null,
                students: null,
                pagination: null,
                deleteStudentAuth: false,
                upsertStudentAuth: false,
                getStudentAuth: false,
                getStudentPDFAuth: false,
                getStudentOrdersPDFAuth: false,
                getStudentInvoicesPDFAuth: false,
                getStudentCartsPDFAuth:false,
                getStudentZipAuth:false,
                upsertAddressAuth: false,
                studentId: null,
                getVatAuth: false,
                verificationAuth: false,
                Vat: null,
                zip: null,
                students_: null,
                getAllStudentAuth: false,
            }
        default:
            return {
                ...state
            }
    }
}