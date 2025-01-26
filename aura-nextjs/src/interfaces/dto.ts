export interface SignupDTO {
  email?: string;
  phone_number?: string;
  country_code?: string;
  password: string;
  username?: string;
}

export interface SigninDTO {
  provider: string;
  password: string;
}

export interface DeliveryAddress {
  region: Regions;
  city: string;
  address: string;
}
export interface OrderDTO {
  documentId?: string;
  region: Regions;
  total_pay: number;
  order_items: OrderItem[];
  order_status: OrderStatus;
  checkout_image: string;
  users_id: string;
  delivery_address: DeliveryAddress;
}

export interface OrderItem {
  documentId?: string;
  order_id?: string;
  product_id: string;
  quantity: number;
}

export interface CartEntityDto {
  documentId: string;
  user_id: string;
  total_pay: number;
  total_items: number;
  products: CartProductsDTO;
}

export interface CartProductsDTO {
  // product id
  [id: string]: {
    product: Product; // product information
    amount: number; // quantity
  };
}

export interface Product {
  documentId: string;
  title: string;
  name: string;
  thumbnail: string;
  images: { id: string; url: string }[];
  price: number;
  stock: number;
  ordered: number;
  discount: number;
  weight?: number;
  color_grade?: string;
  usage: string;
  description: string;
  specifications: string;
  features?: string;
  reviews?: Review[];
  categories: { id: string; documentId: string; title: string }[];
  brand: { id: string; documentId: string; name: string };
}

export interface Review {
  id: string;
  documentId: string;
  text: string;
  rate: number;
  user: { documentId: string; username: string; email: string };
  product: Product;
  likes?: string[];
  updatedAt: string;
}

export type OrderStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "preparing"
  | "out to deliver"
  | "delivered";

export type Regions = "Sudan" | "Egypt" | "KSA";

// Auth DTOs
export interface signUpFormData {
  email: string;
  countryCode: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}
