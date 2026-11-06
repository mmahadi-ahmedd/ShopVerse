export type Role = "admin" | "seller" | "user";
export type DiscountInfo = Pick<Discount, "id" | "percent" | "startsAt" | "endsAt" | "image" | "title">;
export type OrderStatus = "pending_payment" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

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
export interface Discount {
  id: string; sellerId: string; productId: string; percent: number;
  title?: string; image: string; startsAt: string; endsAt: string; createdAt: string;
}
export interface OrderLine { productId: string; sellerId: string; title: string; image: string | null; price: number; quantity: number }
export interface Shipping { name: string; phone: string; address: string; city: string }
export interface Order {
  id: string; userId: string; status: OrderStatus; subtotal: number;
  shipping: Shipping; items: OrderLine[]; stripeSessionId?: string; createdAt: string; paidAt?: string;
}
export interface ProductView extends Product { finalPrice: number; discount?: DiscountInfo }
export interface CartItem { productId: string; quantity: number; price: number; title: string; image?: string; }