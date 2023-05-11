import { toast } from 'react-toastify';
import { BEFORE_APPLICATION, GET_APPLCIATIONS } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';
export const beforeApplication = () => {
    return {
        type: BEFORE_APPLICATION
    }
}
export const getApplications = (qs = '', body = {}) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}loanApplications/list`;
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
                toast.success(data.message)
            }

            dispatch({
                type: GET_APPLCIATIONS,
                payload: data.data
            })
        } else {
            toast.error(data.message)
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
    })
};