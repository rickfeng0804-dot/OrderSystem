export type SizeOption = { name: string; priceModifier: number };
export type AddOnOption = { name: string; price: number };

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: number;
  sizes: SizeOption[];
  addOns: AddOnOption[];
  image?: string;
}

export interface OrderItem {
  id: string;
  menuId: string;
  name: string;
  size: string;
  addOns: string[];
  qty: number;
  subtotal: number;
}

export type OrderStatus = '製作中' | '待結帳' | '已完成';

export interface Order {
  orderId: string;
  tableNumber: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  timestamp: string;
}
