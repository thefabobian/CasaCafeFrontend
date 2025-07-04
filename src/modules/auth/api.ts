import axios from 'axios';
import { AuthUser, LoginPayload } from './types';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const loginRequest = async (payload: LoginPayload): Promise<AuthUser> => {
  const response = await api.post('/login', payload);
  return response.data;
};
