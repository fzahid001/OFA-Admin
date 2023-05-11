import { BEFORE_INTERVIEWER, GET_All_INTERVIEWERS, GET_INTERVIEWERS, UPSERT_INTERVIEWER, DELETE_INTERVIEWER, INTERVIEWER_VERIFICATION } from '../../redux/types';

const initialState = {
    interviewerId: null,
    interviewers: null,
    pagination: null,
    deleteInterviewerAuth: false,
    upsertInterviewerAuth: false,
    upsertAddressAuth: false,
    getInterviewerAuth: false,
    getInterviewerPDFAuth: false,
    getInterviewerOrdersPDFAuth: false,
    getInterviewerInvoicesPDFAuth: false,
    getInterviewerZipAuth:false,
    getInterviewerCartsPDFAuth:false,
    getVatAuth: false,
    verificationAuth: false,
    interviewerStats: null,
    Vat: null,
    interviewers_: null,
    getAllInterviewerAuth: false,
    zip: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case UPSERT_INTERVIEWER:
            return {
                ...state,
                interviewer: action.payload,
                upsertInterviewerAuth: true
            }
        case GET_All_INTERVIEWERS:
            return {
                ...state,
                interviewers_: action.payload.interviewers,
                getAllInterviewerAuth: true
            }
        case DELETE_INTERVIEWER:
            return {
                ...state,
                interviewerId: action.payload.interviewerId,
                interviewers: action.payload.interviewers,
                deleteInterviewerAuth: true
            }
        case GET_INTERVIEWERS:
            return {
                ...state,
                interviewers: action.payload.interviewers,
                pagination: action.payload.pagination,
                interviewerStats: action.payload.interviewerStats,
                getInterviewerAuth: true
            }
       
        case INTERVIEWER_VERIFICATION:
            return {
                ...state,
                verificationAuth: true,
            }
        case BEFORE_INTERVIEWER:
            return {
                ...state,
                interviewer: null,
                interviewers: null,
                pagination: null,
                deleteInterviewerAuth: false,
                upsertInterviewerAuth: false,
                getInterviewerAuth: false,
                getInterviewerPDFAuth: false,
                getInterviewerOrdersPDFAuth: false,
                getInterviewerInvoicesPDFAuth: false,
                getInterviewerCartsPDFAuth:false,
                getInterviewerZipAuth:false,
                upsertAddressAuth: false,
                interviewerId: null,
                getVatAuth: false,
                verificationAuth: false,
                Vat: null,
                zip: null,
                interviewers_: null,
                getAllInterviewerAuth: false,
            }
        default:
            return {
                ...state
            }
    }
}