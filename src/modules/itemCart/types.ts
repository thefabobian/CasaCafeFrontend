// Información del producto
export interface ProductDto {
  id: number;              // ID del producto
  name: string;            // Nombre del producto
  description: string;     // Descripción del producto
  price: number;           // Precio del producto
  stock: number;           // Stock disponible
  imageUrl: string;        // URL de la imagen del producto
}

// Información de los ítems en el carrito
export interface CartItemDto {
  id: number;              // ID del item en el carrito (identificador único de ItemCartEntity)
  product: ProductDto;     // Relación con el producto
  quantity: number;        // Cantidad del producto en el carrito
}

// Información del carrito
export interface CartDto {
  id: number;              // ID del carrito
  customerUuid: string;    // UUID del cliente (asegurando que el tipo UUID sea string)
  items: CartItemDto[];    // Array de ítems en el carrito (relación con CartItemDto)
}
