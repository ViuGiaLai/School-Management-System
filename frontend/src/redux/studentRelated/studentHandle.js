import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    stuffDone
} from './studentSlice';

// Async thunks
export const getAllStudents = createAsyncThunk(
    'student/getAll',
    async (id, { rejectWithValue }) => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/students/Students/${id}`);
            if (result.data.message) {
                return rejectWithValue(result.data.message);
            }
            return result.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const updateStudentFields = createAsyncThunk(
    'student/updateFields',
    async ({ id, fields, address }, { rejectWithValue }) => {
        try {
            const result = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/api/students/${address}/${id}`,
                fields,
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (result.data.message) {
                return rejectWithValue(result.data.message);
            }
            return result.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const removeStuff = createAsyncThunk(
    'student/remove',
    async ({ id, address }, { rejectWithValue }) => {
        try {
            const result = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/api/students/${address}/${id}`
            );
            if (result.data.message) {
                return rejectWithValue(result.data.message);
            }
            return result.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

export const registerStudent = createAsyncThunk(
    'student/register',
    async (studentData, { rejectWithValue }) => {
        try {
            console.log('Sending request to:', `${process.env.REACT_APP_BASE_URL}/api/students/StudentCreate`);
            const result = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/students/StudentCreate`,
                studentData,
                { 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            console.log('Response data:', result.data);
            
            if (result.data.message) {
                return rejectWithValue(result.data.message);
            }
            
            return result.data;
        } catch (error) {
            console.error('API Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });
            
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.message || 
                               'Failed to register student';
            
            return rejectWithValue(errorMessage);
        }
    }
);