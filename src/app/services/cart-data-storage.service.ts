import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { CartService } from './cart.service';
import { BehaviorSubject, tap } from 'rxjs';
import { Cart, Order } from '../models/cart.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartDataStorageService {
  constructor(private cartSer: CartService, private http: HttpClient) {}
  localCartItemNum = new BehaviorSubject<any>(null);

  ///////user loggen in phase
  generalFunction() {
    let cartStore = localStorage.getItem('localCart');
    let userStore = localStorage.getItem('authUser');
    let userData = userStore && JSON.parse(userStore)[0];
    // if (userStore) {
      if (cartStore && userStore) {
        let cartData = JSON.parse(cartStore);
        // let cartArr : Cart[]=[];
        cartData.forEach((product: Product) => {
          let authcartItem: Cart = {
            ...product,
            userId: userData.id,
            ProductId: product.id,
          };
          delete authcartItem.id;
          setTimeout(() => {
            this.addToCartOnLogIn(authcartItem).subscribe();

            localStorage.removeItem('localCart');
          }, 500);
        });

        // return this.getCartItemFromDB();
      // }
      // this.getCartItemFromDB().subscribe();
      // } else {
      //   // this.getCartItemFromDB().subscribe();
      // }

    // return this.getCartItemFromDB();
    }
     //return this.getCartItemFromDB();
  }

  addToCartOnLogIn(cartItem: Cart) {
    console.log('cartItem');
    console.log(cartItem);

    // this.cartSer.addCartItem(cartItem);
    return this.http
      .post<Cart>('http://localhost:3000/carts', cartItem)
      .pipe(tap((res) => this.cartSer.addCartItem(res)));
  }

  getCartItemFromDB() {
    let userStore = localStorage.getItem('authUser');
    let userData = userStore && JSON.parse(userStore)[0].id;

    return this.http
      .get<Cart[]>('http://localhost:3000/carts?userId=' + userData)
      .pipe(tap((res) =>{
      console.log(res)
      
      this.cartSer.setCartItems(res)}));
  }

  getCartItemFromDBPerId(id: number) {
    return this.http.get<Cart[]>('http://localhost:3000/carts/' + id);
  }

  removeFromCartAfterLogIn(idsArr: any[]) {
    const arrayOfObjects = this.cartSer.getAllCartItems();

    for (let i = 0; i < arrayOfObjects.length; i++) {
      for (let index = 0; index < idsArr.length; index++) {
        if ((arrayOfObjects[i].id == idsArr[index])) {         
        // console.log(arrayOfObjects[i].id); 
          this.http
            .delete('http://localhost:3000/carts/' + arrayOfObjects[i].id)
            .subscribe((res) => {
              console.log('deleted');
            });
        }
      }
    }
    this.cartSer.deleteCartItem(idsArr);
  }
///orderPart
  orderNow(order:Order) {
    return this.http
      .post<Cart>('http://localhost:3000/orders', order)
  }

  getAllOrders() {
    let userStore = localStorage.getItem('authUser');
    let userData = userStore && JSON.parse(userStore)[0].id;

    return this.http
      .get<Order[]>('http://localhost:3000/orders?userId=' + userData)
  }
  cancelOrder(id:number){
    return this.http
    .delete('http://localhost:3000/orders/' + id);
  }
  /////////////////////////////////
}
