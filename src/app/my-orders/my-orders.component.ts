import { Component, OnInit } from '@angular/core';
import { Order } from '../models/cart.model';
import { CartService } from '../services/cart.service';
import { CartDataStorageService } from '../services/cart-data-storage.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  orderData!: Order[];
  constructor(private cartDBSer:CartDataStorageService) {}
  ngOnInit() {
     this.getOrderList();
  }

  cancelOrder(orderId:number|undefined){
    orderId && this.cartDBSer.cancelOrder(orderId).subscribe((result)=>{
      if(result){
        this.getOrderList();
      }
    })
  }

  getOrderList(){
    this.cartDBSer.getAllOrders().subscribe(
      (result)=>{
        console.log(result);
        this.orderData=result
      }
     );
  }

}
