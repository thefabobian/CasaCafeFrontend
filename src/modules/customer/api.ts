import axios from "axios";
import { CustomerPayload } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type' : 'application/json' }
});

// Crear un nuevo cliente
export const crearCliente = async (payload: CustomerPayload) => 
  {await api.post(`/customer`, payload);
};

// Obtener todos los clientes paginados
export const getAllCustomers = async (): Promise<CustomerPayload[]> => {
  const response = await api.get("/customer");
  return response.data.content || response.data;
};