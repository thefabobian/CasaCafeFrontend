import axios from 'axios';
import { CartDto, CustomerDto, ProductDto } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Obtener productos paginados y filtrados por nombre opcionalmente
export const getAllProducts = async (page = 0,size = 9,searchTerm = "") => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());

  if (searchTerm.trim()) {
    params.append("name", searchTerm);
    const response = await api.get(`/product/search?${params.toString()}`);
    return response.data;
  } else {
    const response = await api.get(`/product?${params.toString()}`);
    return response.data;
  }
};

// Obtener carrito por UUID de cliente
export const getCartByCustomerUuid = async (uuid: string): Promise<CartDto> => {
  const response = await api.get(`/cart/${uuid}`);
  return response.data;
};

// Obtene todos los clientes (para buscar UUID por email)
export const getAllCustomers = async (): Promise<{ content: CustomerDto[] }> => {
  const response = await api.get("/customer?size=1000");
  return response.data;
};

// Obtener un producto por ID
export const getProductById = async (id: number): Promise<ProductDto> => {
  const response = await api.get(`/product/${id}`);
  return response.data;
};