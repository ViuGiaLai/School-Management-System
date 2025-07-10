import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    postDone,
    doneSuccess
} from './teacherSlice';

export const getAllTeachers = (schoolId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/teachers/Teachers/${schoolId}`);
        if (Array.isArray(result.data)) {
            dispatch(getSuccess(result.data));
        } else {
            dispatch(getSuccess([]));
        }
    } catch (error) {
        dispatch(getError(error?.response?.data?.message || "Failed to fetch teachers"));
    }
};

export const getTeacherDetails = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/teachers/Teachers/${id}`);
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error?.response?.data?.message || "Failed to fetch teacher detail"));
    }
};

export const updateTeachSubject = (teacherId, teachSubject) => async (dispatch) => {
    if (!teacherId) {
        dispatch(getError("Teacher ID is missing"));
        return;
    }

    dispatch(getRequest());

    try {
        await axios.put(
            `${process.env.REACT_APP_BASE_URL}/api/teachers/Teachers/${teacherId}`,
            teachSubject,
            { headers: { 'Content-Type': 'application/json' } }
        );
        dispatch(postDone());
    } catch (error) {
        dispatch(getError(error?.response?.data?.message || "Failed to update subject"));
    }
};
