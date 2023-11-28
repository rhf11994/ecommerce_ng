import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { signUpUser } from '../models/user.model';
import { BehaviorSubject, Subject, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { CartService } from './cart.service';
import { ProductService } from './product.service';

export interface authResponse {
  userName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class dataStorage {
  products!: Product[];
  user = new BehaviorSubject<boolean>(false);
  sellerUser!: signUpUser;
  onUpdateCartNum = new BehaviorSubject<any>(null);
  onUpdateList = new BehaviorSubject<any>(null);
  allCartItem!: Cart[];
  constructor(
    private http: HttpClient,
    private router: Router,
    private productSer: ProductService,
    private cartSer: CartService
  ) {}

  userSignUp(email: string, password: string, userName: string) {
    return this.http
      .post<authResponse>('http://localhost:3000/seller', {
        userName: userName,
        email: email,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          console.log(resData);
          localStorage.setItem('resData', JSON.stringify(resData));
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .get<authResponse>('http://localhost:3000/seller', {
        params: {
          email: email,
          password: password,
        },
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          localStorage.setItem('resData', JSON.stringify(resData));
        })
      );
  }

  Logout() {
    localStorage.removeItem('resData');
    this.router.navigate(['/']);
  }

  //Product APIs///////////////////////////////////////////////////////////////////////////
  addProduct(productItem: Product) {
    return this.http
      .post<Product>('http://localhost:3000/products', productItem)
      .pipe(
        catchError(this.handleError),
        tap((resData) => {})
      );
  }

  fetchProducts() {
    return this.http
      .get<Product[]>('http://localhost:3000/products')
      .pipe(tap((products) => this.productSer.setProducts(products)));
  }

  deleteProduct(id: number) {
    let productItem = this.productSer.getItemPerId(id);

    this.http
      .delete<Product[]>('http://localhost:3000/products/' + productItem.id)
      .subscribe((res) => this.productSer.deleteProduct(id));
  }

  updateProduct(id: number, product: Product) {
    let productItem = this.productSer.getItemPerId(id);
    return this.http.put<Product>(
      `http://localhost:3000/products/${productItem.id}`,
      product
    );
  }

  getSomeProducts(id: number) {
    return this.http.get<Product[]>(
      'http://localhost:3000/products?_limit=' + id
    );
  }

  searchProduct(query: string) {
    return this.http.get<Product[]>(
      'http://localhost:3000/products?q=' + query
    );
  }

  fetchProductPerId(id: number) {
    return this.http.get<Product>('http://localhost:3000/products/' + id);
  }
  //////cartPart///////////////

  // addToCartLocalStorage(selectedProduct: Product) {
  //   let cartData = [];
  //   let localCart = localStorage.getItem('localCart');
  //   if (!localCart) {
  //     localStorage.setItem('localCart', JSON.stringify([selectedProduct]));
  //   } else {
  //     cartData = JSON.parse(localCart);
  //     cartData.push(selectedProduct);
  //     localStorage.setItem('localCart', JSON.stringify(cartData));
  //   }
  //   this.getCartNumber();
  // }

  // getCartNumber() {
  //   let cartStore = localStorage.getItem('localCart');
  //   if (cartStore) {
  //     let cartData = JSON.parse(cartStore);
  //     let cartItemNum = cartData.length;
  //     this.onUpdateCartNum.next(cartItemNum);
  //   }
  // }

  // removeFromCartLocal(id: number) {
  //   let cartStore = localStorage.getItem('localCart');

  //   if (cartStore) {
  //     let cartData = JSON.parse(cartStore);
  //     let cartSelectedItems = cartData.filter(
  //       (item: Product) => item.id !== id
  //     );
  //     localStorage.setItem('localCart', JSON.stringify(cartSelectedItems));
  //     this.onUpdateCartNum.next(cartSelectedItems);
  //     this.getCartNumber();
  //   }
  // }

  // addToCart(cartItem: Cart, userId: number) {
  //   let allCartItems: any = [];
  //   this.getCartList(userId).subscribe((res) => {
  //     // console.log('saved items related to this user');
  //     // console.log(res);
  //     allCartItems = res;
  //   });

  //   console.log('saved items related to this user');
  //   console.log(allCartItems);

  //   //if(items.s.some(el => ids.includes(el))) alert("wohoo");

  //   return this.http.post<Cart>('http://localhost:3000/carts', cartItem);
  // }

  // getCartList(userId: number) {
  //   // return this.http
  //   //   .get<Cart[]>('http://localhost:3000/carts?userId=' + userId)
  //   //   .pipe(
  //   //     tap((res) => {
  //   //       this.onUpdateCartNum.next(res.length);
  //   //       // this.onUpdateList.next(res);
  //   //     })
  //   //   );

  //   return this.http
  //     .get<Cart[]>('http://localhost:3000/carts?userId=' + userId)
  //     .pipe(tap((cartItems) => this.cartSer.setCartItems(cartItems)));
  // }

  // deletFromCartAuth(id: any, userId: number) {
  //   console.log('product ID');
  //   console.log(id);

  //   this.http
  //     .delete('http://localhost:3000/carts/' + id)
  //     .subscribe((res) => console.log('deleted'));
  //   this.getCartList(userId).subscribe((res) => {});
  // }

  //////cartPart///////////////

  /////////end product///////////////////////////////////////////////////////////
  reloadSeller() {
    if (localStorage.getItem('resData')) {
      this.user.next(true);
      this.router.navigate(['/seller-home']);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
