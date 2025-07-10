import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Adjust the URL as needed

export const registerUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { email, password });
        return response.data;
    } catch (error) {
        if ((error as any).isAxiosError) {
            throw (error as any).response?.data || (error as any).message;
        } else if (error instanceof Error) {
            throw error.message;
        } else {
            throw error;
        }
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        // Type guard for AxiosError
        if ((error as any).isAxiosError || (error && (error as any).response)) {
            throw (error as any).response?.data || (error as any).message;
        } else if (error instanceof Error) {
            throw error.message;
        } else {
            throw error;
        }
    }
};