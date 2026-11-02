export type Role = "admin" | "seller" | "user";

export interface User {
  id: string; name: string; email: string; role: Role;
  passwordHash: string; createdAt: string;
}
export interface Category { id: string; name: string; slug: string; }
export interface Product {
  id: string; sellerId: string; categoryId: string;
  title: string; slug: string; description: string;
  price: number; stock: number; images: string[]; createdAt: string;
}
export interface CartItem { productId: string; quantity: number; price: number; title: string; image?: string; }