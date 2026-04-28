import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartState, CartAction, Cookie, CartItem } from '../types';

const initialState: CartState = {
  items: [],
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.cookie.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.cookie.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { cookie: action.payload, quantity: 1 }] };
    }
    case 'DECREASE_QTY': {
      const item = state.items.find(i => i.cookie.id === action.payload);
      if (!item) return state;
      if (item.quantity === 1) {
        return { ...state, items: state.items.filter(i => i.cookie.id !== action.payload) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.cookie.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    }
    case 'INCREASE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.cookie.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.cookie.id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalPrice: number;
  addItem: (cookie: Cookie) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.cookie.price * i.quantity, 0);

  const addItem = (cookie: Cookie) => dispatch({ type: 'ADD_ITEM', payload: cookie });

  return (
    <CartContext.Provider value={{ state, dispatch, totalItems, totalPrice, addItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
