import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { signUpUser } from '../models/user.model';
import { Observable } from 'rxjs/internal/Observable';
import { AuthServiceService, authResponse } from './auth-service.service';
import { Router } from '@angular/router';
import { Cart } from '../models/cart.model';
import { dataStorage } from '../services/dataStorage.service';
import { Product } from '../models/product.model';
import { CartDataStorageService } from '../services/cart-data-storage.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  loggedIn = false;
  authObesrv!: Observable<authResponse>;
  @ViewChild('signupForm') signupForm!: NgForm;
  @ViewChild('loginForm') loginForm!: NgForm;

  error!: string;
  constructor(
    private authSer: AuthServiceService,
    private cartSer: CartService,
    private router: Router,
    private cartDSSer: CartDataStorageService
  ) {}
  ngOnInit() {
    this.authSer.userAuthReload();
  }

  login() {
    this.loggedIn = true;
  }
  signUp() {
    this.loggedIn = false;
  }

  onLogin() {
    if (!this.loginForm.valid) {
      return;
    }
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    if (this.loggedIn) {
      this.authObesrv = this.authSer.login(email, password);
    }

    this.subscribeAuth();
  }

  OnSubmit() {
    if (!this.signupForm.valid) {
      return;
    }

    const email = this.signupForm.value.email;
    const userName = this.signupForm.value.userName;
    const password = this.signupForm.value.password;
    this.authObesrv = this.authSer.userSignUp(email, password, userName);
    this.subscribeAuth();

    this.signupForm.reset();
  }

  localCartToRemoteCart() {
    let cartStore = localStorage.getItem('localCart');
    let userStore = localStorage.getItem('authUser');
    let userData = userStore && JSON.parse(userStore)[0];

    if (userStore) {
      if (cartStore) {
        // let cartData = JSON.parse(cartStore);
        // // let cartArr : Cart[]=[];
        // cartData.forEach((product: Product) => {
        //   let authcartItem: Cart = {
        //     ...product,
        //     userId: userData.id,
        //     ProductId: product.id,
        //   };
        //   delete authcartItem.id;
        //   setTimeout(() => {
        //      this.cartDSSer.addToCartOnLogIn(authcartItem).subscribe();
        //     localStorage.removeItem('localCart');
        //   }, 500);
        // });

        //console.log(this.cartSer.getAllCartItems());
        this.cartDSSer.generalFunction();
      }else{
        this.cartDSSer.getCartItemFromDB().subscribe();
        // .subscribe();
        //console.log(this.cartSer.getAllCartItems());
      }
      // this.cartSer.setCartItems(cartArr);

      // setTimeout(() => {
      //   this.cartDSSer.addToCartOnLogIn(authcartItem).subscribe((res) => {
      //     if (res) {
      //       alert('item added to cart successfully+res');
      //       localStorage.removeItem('localCart');
      //     } else {
      //       console.log('error');
      //     }
      //   });
      // }, 500);
      // });

      // if (cartStore) {
      //   let cartData = JSON.parse(cartStore);
      //   cartData.forEach((product: Product) => {
      //     let authcartItem: Cart = {
      //       ...product,
      //       userId: userData.id,
      //       ProductId: product.id,
      //     };
      //     delete authcartItem.id;

      //     setTimeout(() => {
      //       this.cartDSSer.addToCartOnLogIn(authcartItem).subscribe((res) => {
      //         if (res) {
      //           alert('item added to cart successfully+res');
      //           localStorage.removeItem('localCart');
      //         } else {
      //           console.log('error');
      //         }
      //       });
      //     }, 500);
      //   });

      //   this.cartSer.getAllCartItems();
      // } else {
      //   this.cartDSSer.getCartItemFromDB().subscribe();;
      // }
    }
  }

  subscribeAuth() {
    this.authObesrv.subscribe((response: any) => {
      if (response && response.length > 0) {
        this.localCartToRemoteCart();
        this.router.navigate(['/home']);
      } else {
        this.error = 'un correct username or password';
      }
    });
  }
}
