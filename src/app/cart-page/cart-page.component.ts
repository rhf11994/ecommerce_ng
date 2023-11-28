import { Component, OnInit } from '@angular/core';
import { Cart, PriceSummary } from '../models/cart.model';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cartData: Cart[] = [];
  priceSummary: PriceSummary = {
    price: 0,
    tax: 0,
    delivery: 0,
    discount: 0,
    total: 0,
  };
  constructor(private cartSer: CartService, private router: Router) {}
  ngOnInit(): void {
    this.cartData = this.cartSer.getAllCartItems();
    let price = 0;
    this.cartData.forEach((element: Cart) => {
      console.log(element);

      if (element) {
        if (element.quantity) {
         // this.priceSummary.price += +element.price * element.quantity;
          price = price + (+element.price * +element.quantity)
        }
      }
      // 
    });

    this.priceSummary.price = price;
    this.priceSummary.discount = price / 10;
    this.priceSummary.tax = price / 10;
    this.priceSummary.delivery = 100;
    this.priceSummary.total = price + price / 10 + 100 - price / 10;

    if (!this.cartData.length) {
      this.router.navigate(['/']);
    }
  }

  checkout() {
    this.router.navigate(['/checkout'])
  }
}
