import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { Cart, Order } from '../models/cart.model';
import { CartDataStorageService } from '../services/cart-data-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css'],
})
export class CheckOutComponent implements OnInit {
  totalPrice!: number;
  cartData: Cart[] = [];
  checkOut!: Order;
  orderMsg:string|undefined;
  constructor(
    private cartSer: CartService,
    private cartDBSer: CartDataStorageService,
    private router:Router
  ) {}
  ngOnInit(): void {
    this.cartData = this.cartSer.getAllCartItems();
    console.log(this.cartData);

    let price = 0;
    this.cartData.forEach((element: Cart) => {
      if (element) {
        if (element.quantity) {
          price += +element.price * +element.quantity;
        }
      }
    });

    this.totalPrice = price + price / 10 + 100 - price / 10;
  }
  orderNow(data: Order) {
    let userStore = localStorage.getItem('authUser');
    let userData = userStore && JSON.parse(userStore)[0];
    if (userStore && data) {
      this.checkOut = {
        ...data,
        userId: userData.id,
        totalPrice: this.totalPrice,
      };
    }


    
    this.cartData?.forEach((item) => {
      setTimeout(() => {
        item.id && this.cartDBSer.removeFromCartAfterLogIn([item.id]);
      }, 700)
    })



    this.cartDBSer.orderNow(this.checkOut).subscribe((res) => {
      if (res) {
        this.orderMsg = "Order has been placed";
        setTimeout(() => {
          this.orderMsg = undefined;
          this.router.navigate(['/myorder'])
        }, 4000);
      }
    });
  }
}
