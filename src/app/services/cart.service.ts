import { Injectable } from '@angular/core';
import { Cart } from '../models/cart.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  carts: Cart[] = [];
  cartProducts: Product[] = [];
  listChanged = new BehaviorSubject<any>(null);
  // listChanged = new BehaviorSubject<any>([]);
  constructor() {}
  /////befor user auth login

  checkCartNumber() {
    let localCartt = localStorage.getItem('localCart');
    if (localCartt) {
      let itemsArr = JSON.parse(localCartt);
      return this.listChanged.next(itemsArr);
    } else {
      return this.listChanged.next(this.getAllCartItemsLocal());
    }
  }

  setCartItemsLocal() {
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      this.listChanged.next(this.cartProducts.slice());
    } else {
      console.log('setCartItemsLocal');
      let cartData = JSON.parse(localCart);
      cartData.forEach((element: any) => {
        this.cartProducts.push(element);
      });
    }

    return this.cartProducts.slice();
  }

  getAllCartItemsLocal() {
    return this.cartProducts.slice();
  }
  clearCartItemsLocal() {
    this.cartProducts = [];
    this.listChanged.next(this.cartProducts.slice());
  }
  addCartItemLocal(product: Product) {
    let localCart = localStorage.getItem('localCart');
   
    if (product == null) {
      this.cartProducts = [];
    } else {
      if (!localCart) {
        localStorage.setItem('localCart', JSON.stringify([product]));
        this.cartProducts = [product];
      } else {
        let cartData = JSON.parse(localCart);
        this.cartProducts = JSON.parse(localCart);
        cartData.push(product);

        localStorage.setItem('localCart', JSON.stringify(cartData));
        this.cartProducts.push(product);
      }
    }

    this.listChanged.next(this.cartProducts.slice());
  }
  getCartItemPerIdLocal(id: number) {
    return this.cartProducts.slice()[id];
  }

  deleteCartItemLocal(elementItems: Product[]) {
    localStorage.removeItem('localCart');
    this.clearCartItemsLocal();

    elementItems.forEach((element) => {
      this.addCartItemLocal(element);
    });

    this.listChanged.next(this.cartProducts.slice());
  }

  ///////////////////////////////////

  /////After user auth login

  setCartItems(cart: Cart[]) {
    if (cart == null) {
      this.carts = [];
    } else {
      this.carts = cart;
    }
    console.log('items');
    console.log(this.carts.slice());

    this.listChanged.next(this.carts.slice());
  }

  getAllCartItems() {
    console.log('getAllCartItems call');
    return this.carts.slice();
  }

  addCartItem(cartItem: Cart) {
    this.carts.push(cartItem);
    this.listChanged.next(this.carts.slice());
  }
  getCartItemPerId(id: number) {
    return this.carts.slice()[id];
  }
  deleteCartItem(idsArr: any[]) {
    // console.log('inservice');
    // console.log(idsArr);

    let listToDelete = idsArr;

    // console.log('listToDelete');
    // console.log(listToDelete);

    let arrayOfObjects = this.getAllCartItems();

    // console.log('arrayOfObjects');
    // console.log(arrayOfObjects);

    for (var i = 0; i < arrayOfObjects.length; i++) {
      var obj = arrayOfObjects[i];

      if (listToDelete.indexOf(obj.id) !== -1) {
        arrayOfObjects.splice(i, 1);
        i--;
      }
    }

    // console.log('arrayOfObjectsAfter delete');
    // console.log(arrayOfObjects);

    this.carts = arrayOfObjects;
    this.listChanged.next(this.carts.slice());
  }

  ///////////////////////////////////
}
