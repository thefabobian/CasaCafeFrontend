export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface CartItemDto{
  id: number;
  product: ProductDto;
  quantity: number;
}

export interface CartDto{
  id: number;
  customerUuid: string;
  items: CartItemDto[];
}

export interface CustomerPayload{
  uuid: string;
  username: string;
  email: string;
  password: string;
  dni: string;
  phone: string;
  address: string;
  birth: string;
}

export interface CustomerDto {
  uuid: string;
  username: string;
  email: string;
  dni: string;
  phone: string;
  address: string;
  birth: string;
  createdAt: string;
}

