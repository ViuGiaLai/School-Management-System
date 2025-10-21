import { createSlice } from "@reduxjs/toolkit";
import {
    getAllStudents,
    updateStudentFields,
    removeStuff,
    registerStudent
} from './studentHandle';

const initialState = {
    studentsList: [],
    loading: false,
    error: null,
    response: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    registerStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    registerError: null,
    registeredStudent: null
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
        resetRegisterStatus: (state) => {
            state.registerStatus = 'idle';
            state.registerError = null;
            state.registeredStudent = null;
        },
        underStudentControl: (state) => {
            state.status = 'idle';
            state.error = null;
            state.registerStatus = 'idle';
            state.registerError = null;
        }
    },
    extraReducers: (builder) => {
        // Register Student
        builder.addCase(registerStudent.pending, (state) => {
            state.registerStatus = 'loading';
            state.registerError = null;
        });
        builder.addCase(registerStudent.fulfilled, (state, action) => {
            state.registerStatus = 'succeeded';
            state.registeredStudent = action.payload;
            state.studentsList.push(action.payload);
        });
        builder.addCase(registerStudent.rejected, (state, action) => {
            state.registerStatus = 'failed';
            state.registerError = action.payload;
        });

        // Get All Students
        builder.addCase(getAllStudents.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(getAllStudents.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.studentsList = action.payload;
        });
        builder.addCase(getAllStudents.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // Update Student Fields
        builder.addCase(updateStudentFields.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(updateStudentFields.fulfilled, (state) => {
            state.status = 'succeeded';
        });
        builder.addCase(updateStudentFields.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // Remove Stuff
        builder.addCase(removeStuff.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(removeStuff.fulfilled, (state) => {
            state.status = 'succeeded';
        });
        builder.addCase(removeStuff.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    }
});

// Selectors
export const selectAllStudents = (state) => state.student.studentsList;
export const selectStudentStatus = (state) => state.student.status;
export const selectStudentError = (state) => state.student.error;
export const selectRegisterStatus = (state) => state.student.registerStatus;
export const selectRegisterError = (state) => state.student.registerError;
export const selectRegisteredStudent = (state) => state.student.registeredStudent;

export const { resetStatus, resetRegisterStatus, underStudentControl } = studentSlice.actions;

// Export the reducer as both default and named export
export const studentReducer = studentSlice.reducer;
export default studentReducer;