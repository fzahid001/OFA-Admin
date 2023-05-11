import { toast } from 'react-toastify';
import { GET_All_STUDENTS, GET_ERRORS, BEFORE_STUDENT, GET_STUDENTS, DELETE_STUDENT, UPSERT_STUDENT, STUDENT_VERIFICATION, UPSERT_EXTRACT } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';
import axios
 from 'axios';
export const beforeStudent = () => {
    return {
        type: BEFORE_STUDENT
    }
}
export const createStudent = (body = {}) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}student/create`;
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: UPSERT_STUDENT,
                payload: data.data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data.data
            })
        }

    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
}
export const editStudent = (Id, body = {}) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}student/edit/${Id}`;
    fetch(url, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: UPSERT_STUDENT,
                payload: data.student
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data.data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
}
export const getStudents = (qs = '', body = {}, toastCheck = true) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}student/list`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform': 2

        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if (!qs) {
                if (toastCheck) {
                    toast.success(data.message)
                }
            }

            dispatch({
                type: GET_STUDENTS,
                payload: data.data
            })
        } else {
            if (!qs)
                toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const deleteStudent = (Id) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}student/delete/${Id}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: DELETE_STUDENT,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const addAddress = (body = {}) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}student/addAddress`;
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: UPSERT_STUDENT,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }

    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
}

export const deleteStudentAddress = (studentId, addressId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}student/deleteAddress/${studentId}/${addressId}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: UPSERT_STUDENT,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const getVATforCountry = (countryname) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}student/getVATforCountry/${countryname}`;
   

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {

        } else {
            if (!qs)
                toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const sendVerificationEmail = (Id) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}student/send-verification-email/${Id}`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: STUDENT_VERIFICATION
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
}

export const uploadExtract = (e = {}, studentId) => dispatch => {
    dispatch(emptyError());
    let url = `${process.env.REACT_APP_BASE_URL}student/uploadExtract`;
    let data = new FormData();
    data.append('extractFile', e.target.files[0]);
    data.append('studentId', studentId);
    axios({
        method: 'post',
        url:url,
        data: data,
        headers: {'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${process.env.REACT_APP_AUTHORIZATION}`,
                'x-auth-token': process.env.REACT_APP_X_AUTH_TOKEN}
        })
        .then(data => {
           
            if (data.data.success) {
                toast.success(data.data.message)
                dispatch({
                    type: UPSERT_EXTRACT,
                    payload: data.data
                })
            } else {
                toast.error(data.data.message)
                dispatch({
                    type: GET_ERRORS,
                    payload: data.data
                })
            }
        })
        .catch(error => {
            if (error.response && error.response.data) {
                const { data } = error.response
                if (data.message)
                    toast.error(data.message)
            }
            dispatch({
                type: GET_ERRORS,
                payload: error
            })
        })
}

export const getAllStudents = (qs = '', body = {}, toastCheck = true) => dispatch => {

    dispatch(emptyError());
    let url = `${ENV.url}lawfulInterception/allStudent/list`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform': 2

        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if (!qs) {
                if (toastCheck) {
                    toast.success(data.message)
                }
            }

            dispatch({
                type: GET_All_STUDENTS,
                payload: data.data
            })
        } else {
            if (!qs)
                toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};