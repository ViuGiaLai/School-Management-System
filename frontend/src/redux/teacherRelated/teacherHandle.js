import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getError,
    postDone,
    doneSuccess
} from './teacherSlice';

export const getAllTeachers = (schoolId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        // Nếu schoolId không hợp lệ (không phải 24 ký tự hex), không gọi API
        if (!schoolId || typeof schoolId !== "string" || schoolId.length !== 24) {
            dispatch(getError("Invalid schoolId for fetching teachers"));
            return;
        }
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/teachers/Teachers/${schoolId}`);
        if (Array.isArray(result.data)) {
            dispatch(getSuccess(result.data));
        } else {
            dispatch(getSuccess([]));
        }
    } catch (error) {
        dispatch(getError(error?.response?.data?.message || "Internal server error"));
    }
};

export const getTeacherDetails = (teacherId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        // Kiểm tra teacherId hợp lệ trước khi gọi API
        if (!teacherId || typeof teacherId !== "string" || teacherId.length !== 24) {
            dispatch(getError("Invalid teacherId for fetching teacher detail"));
            return;
        }
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/teachers/Teacher/${teacherId}`);
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        // Log lỗi chi tiết để debug
        console.error("getTeacherDetails error:", error?.response?.data || error);
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
            `${process.env.REACT_APP_BASE_URL}/api/teachers/Teacher/update-subject`,
            { teacherId, teachSubject }, 
            { headers: { 'Content-Type': 'application/json' } }
        );
        dispatch(postDone());
    } catch (error) {
        dispatch(getError(error?.response?.data?.message || "Failed to update subject"));
    }
};
