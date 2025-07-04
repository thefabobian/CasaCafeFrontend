export interface CustomerPayload {
  uuid?: string; // ?Opcional, se genera desde el backend y solo para actualizaciones
  username: string;
  email: string;
  password: string;
  dni: string;
  phone: string;
  address: string;
  birth: string; // string formato 'YYYY - MM - DD' para input date
}