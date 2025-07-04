import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  responseType: "blob", // importante para recibir archivo binario
});

export const generarFactura = (payload: { customerUuid: string }) => {
  return api.post("/bill/generar", payload, {
    responseType: "blob",
  }).then((res) => res.data);
};
