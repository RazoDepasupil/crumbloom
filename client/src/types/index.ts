

export interface Cookie {
  id: number;
  name: string;
  description: string;
  price: number;
  tag?: 'Bestseller' | 'New' | 'Fan Fave' | 'Limited';
  emoji: string;
  bgColor: string;
  ingredients: string[];
  allergens: string[];
}

export interface CartItem {
  cookie: Cookie;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Cookie }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'INCREASE_QTY'; payload: number }
  | { type: 'DECREASE_QTY'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' };