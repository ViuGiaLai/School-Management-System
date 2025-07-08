import axios from 'axios';
import {
    authRequest,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
} from './userSlice';

export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        // Xác định module cho từng role
        let module = 'auth';
        if (role === 'Student') module = 'students';
        else if (role === 'Teacher') module = 'teachers';

        const result = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/api/${module}/${role}Login`,
            fields,
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (result.data.role) {
            dispatch(authSuccess(result.data));
        } else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        dispatch(authError(error?.response?.data?.message || error.message));
    }
};

export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        let module = 'auth';
        if (role === 'Student') module = 'students';
        else if (role === 'Teacher') module = 'teachers';

        const result = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/api/${module}/${role}Reg`,
            fields,
            { headers: { 'Content-Type': 'application/json' } }
        );
        console.log("Register API result:", result.data); // Thêm log để kiểm tra dữ liệu trả về

        // Kiểm tra trường hợp thành công dựa trên dữ liệu thực tế trả về
        if (result.data && (result.data.role || result.data.schoolName || result.data._id || result.data.success)) {
            dispatch(authSuccess(result.data));
        }
        else if (result.data && result.data.school) {
            dispatch(stuffAdded());
        }
        else {
            dispatch(authFailed(result.data?.message || "Registration failed"));
        }
    } catch (error) {
        dispatch(authError(error?.response?.data?.message || error.message));
    }
};

export const logoutUser = () => (dispatch) => {
    dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        // address ví dụ: 'Admin', 'Student', 'Teacher'
        let module = 'auth';
        if (address === 'Student') module = 'students';
        else if (address === 'Teacher') module = 'teachers';

        const result = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/${module}/${address}/${id}`
        );
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error?.response?.data?.message || error.message));
    }
}

// export const deleteUser = (id, address) => async (dispatch) => {
//     dispatch(getRequest());

//     try {
//         let module = 'auth';
//         if (address === 'Student') module = 'students';
//         else if (address === 'Teacher') module = 'teachers';

//         const result = await axios.delete(
//             `${process.env.REACT_APP_BASE_URL}/api/${module}/${address}/${id}`
//         );
//         if (result.data.message) {
//             dispatch(getFailed(result.data.message));
//         } else {
//             dispatch(getDeleteSuccess());
//         }
//     } catch (error) {
//         dispatch(getError(error));
//     }
// }

export const deleteUser = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        let module = 'auth';
        if (address === 'Student') module = 'students';
        else if (address === 'Teacher') module = 'teachers';
        else if (address === 'Sclass' || address === 'Sclasses') module = 'classes';
        else if (address === 'Subject' || address === 'Subjects') module = 'subjects';

        let url = '';
        if (address === 'Sclass') {
            url = `${process.env.REACT_APP_BASE_URL}/api/${module}/Sclass/${id}`;
        } else if (address === 'Sclasses') {
            url = `${process.env.REACT_APP_BASE_URL}/api/${module}/Sclasses/${id}`;
        } else if (address === 'Subject') {
            url = `${process.env.REACT_APP_BASE_URL}/api/${module}/Subject/${id}`;
        } else if (address === 'Subjects') {
            url = `${process.env.REACT_APP_BASE_URL}/api/${module}/Subjects/${id}`;
        } else {
            url = `${process.env.REACT_APP_BASE_URL}/api/${module}/${address}/${id}`;
        }

        const result = await axios.delete(url);

        if (result.data && result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getDeleteSuccess());
        }
    } catch (error) {
        dispatch(getError(error?.response?.data?.message || error.message));
    }
}

export const updateUser = (fields, id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        let module = 'auth';
        if (address === 'Student') module = 'students';
        else if (address === 'Teacher') module = 'teachers';

        const result = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/api/${module}/${address}/${id}`,
            fields,
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (result.data.schoolName) {
            dispatch(authSuccess(result.data));
        }
        else {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error?.response?.data?.message || error.message));
    }
}

export const addStuff = (fields, address) => async (dispatch) => {
    dispatch(authRequest());

    let module = 'auth';
    if (address === 'Student') module = 'students';
    else if (address === 'Teacher') module = 'teachers';
    else if (address === 'Sclass' || address === 'Sclasses') module = 'classes';
    else if (address === 'Subject' || address === 'Subjects') module = 'subjects';

    try {
        const result = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/api/${module}/${address}Create`,
            fields,
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded(result.data));
        }
    } catch (error) {
        dispatch(authError(error?.response?.data?.message || error.message));
    }
};