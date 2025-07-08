import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    stuffDone
} from './studentSlice';

export const getAllStudents = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/students/Students/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error?.response?.data?.message || error.message));
    }
}

export const updateStudentFields = (id, fields, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        // address ví dụ: 'Student', 'UpdateExamResult', ...
        const result = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/api/students/${address}/${id}`,
            fields,
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffDone());
        }
    } catch (error) {
        dispatch(getError(error?.response?.data?.message || error.message));
    }
}

export const removeStuff = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/api/students/${address}/${id}`
        );
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffDone());
        }
    } catch (error) {
        dispatch(getError(error?.response?.data?.message || error.message));
    }
}