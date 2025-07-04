import axios from "axios";
import type { CartDto } from "./types";

// Crear una instancia de axios con la base URL del backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Obtener el carrito del cliente por su UUID
export const getCartByCustomerUuid = async (uuid: string): Promise<CartDto> => {
  const response = await api.get(`/cart/${uuid}`);  // Se usa el endpoint para obtener el carrito del cliente
  return response.data;
};

// Agregar o actualizar un ítem en el carrito
export const addOrUpdateItemCart = async (payload: {
  cartId: number | string;
  productId: number;
  quantity: number;
}) => {
  const response = await api.post("/item_cart", payload);  // Usamos el endpoint para agregar o actualizar el ítem
  return response.data;
};

// Actualizar la cantidad de un ítem en el carrito
export const updateItemCartQuantity = async (
  itemId: number,
  payload: { cartId: number | string; productId: number; quantity: number }
) => {
  const response = await api.put(`/item_cart/${itemId}`, payload);
  return response.data;
};


// Eliminar un ítem del carrito
export const deleteItemCart = async (itemId: number) => {
  await api.delete(`/item_cart/${itemId}`);  // Usamos el endpoint para eliminar un ítem
};
