import { CartItem } from '../entities/cart-item.entity';
import { Cart } from '../entities/cart.entity';

export class CartDto {
  id: number;
  status: string;
  totalRegularPrice?: number;
  totalDiscountPrice?: number;
  totalFinalPrice?: number;
  cartItems?: CartItem[];
  selectedCartItems?: CartItem[];

  constructor(cart: Cart) {
    this.id = cart.id;
    this.status = cart.status;
    this.totalRegularPrice = cart.totalRegularPrice;
    this.totalFinalPrice = cart.totalFinalPrice;
    this.totalDiscountPrice = cart.totalDiscountPrice;
    this.cartItems = cart.cartItems;
    this.selectedCartItems = cart.selectedCartItems;
  }
}
