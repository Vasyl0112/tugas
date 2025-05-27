import { ShoppingItem } from '../types/ShoppingItem';

export const calculateTotal = (items: ShoppingItem[]): number => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};