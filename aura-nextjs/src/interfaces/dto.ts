import { User } from '@/entities/user-entity';

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
  recipient_name: string;
  recipient_phone: string;
  recipient_email: string;
}
export interface OrderDTO {
  id?: string;
  documentId?: string;
  region: Regions;
  user: User;
  total_pay: number;
  order_items: OrderItem[];
  order_status: OrderStatus;
  checkout_image: string;
  user_id: string;
  delivery_address: DeliveryAddress;
}

export interface OrderItem {
  documentId?: string;
  order_id?: string;
  product: {
    documentId: string;
    title: string;
    thumbnail: string;
    price: number;
  };
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
  id: string;
  title: string;
  name: string;
  thumbnail: string;
  images: { id?: string; url: string; imageId: string }[];
  price: number;
  stock: number;
  ordered: number;
  viewed?: number;
  discount: number;
  weight: {
    value: number;
    unit: string;
  };
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
  likes?: { documentId: string; username?: string; email?: string }[];
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'onDelivery'
  | 'delivered'
  | 'cancelled';

export type Regions = 'sudan' | 'egypt' | 'KSA';
export interface Region {
  name: string;
  available_cities: City[];
  available: boolean;
}

export interface City {
  name: string;
  available: boolean;
}

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
