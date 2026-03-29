export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  unit?: string;
  category: string;
  image: string;
  popular?: boolean;
  mostInDemand?: boolean;
  isEidSpecial?: boolean;
  originalPrice?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  email?: string;
  notes?: string;
}

export interface Order {
  items: CartItem[];
  customer: CustomerInfo;
  total: number;
  timestamp: Date;
}