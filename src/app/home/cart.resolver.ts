import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { dataStorage } from '../services/dataStorage.service';

import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { CartService } from '../services/cart.service';
import { CartDataStorageService } from '../services/cart-data-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CartResolver implements Resolve<Cart[] | Product[]> {
  cartList!: Cart[];
  productList!: Product[];
  constructor(
    private cartSer: CartService,
    private cartDSSer: CartDataStorageService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let userStore = localStorage.getItem('authUser');

    if (userStore) {
      console.log('resolver');
     //this.cartDSSer.getCartItemFromDB();
     const cartList = this.cartSer.getAllCartItems();
      console.log('cartList');
      console.log(cartList);
     
      if (cartList.length === 0) {
        console.log('generalFunction');
        return this.cartDSSer.getCartItemFromDB();

      } else {
        console.log('not generalFunction');
        return cartList;
      } 
    } else {
      this.productList = this.cartSer.getAllCartItemsLocal();
      console.log(this.productList);

      if (this.productList.length === 0) {
        return this.cartSer.setCartItemsLocal();
      } else {
        return this.productList;
      }
    }
  }
}
