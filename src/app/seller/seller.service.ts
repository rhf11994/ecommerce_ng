// import { Injectable } from '@angular/core';
// import { Product } from '../models/product.model';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class SellerService {
//   products: Product[] = [];
//   listChanged = new Subject();

//   public selectedItem = new Subject<number>();
 
//   constructor() {}

//   setProducts(product: Product[]) {
//     if (product == null) {
//       this.products = [];
//     } else {
//       this.products = product;
//     }
//     this.listChanged.next(this.products.slice());
//   }
//   getAllProducts() {
//     return this.products.slice();
//   }
//   getItemPerId(id: number) {
//     return this.products.slice()[id];
//   }
//   deleteProduct(id: number) {
//     this.products.splice(id, 1);
//     this.listChanged.next(this.products.slice());
//   }
//   addProduct(product: Product) {
//     this.products.push(product);
//     this.listChanged.next(this.products.slice());
//   }
//   updateProduct(id: number,product: Product) {
//     this.products[id]=product;
//     this.listChanged.next(this.products.slice());
//   }

  
 
// }
