import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products: Product[] = [];
  listChanged = new Subject();
  constructor() {}

  /////After user auth login
  setProducts(product: Product[]) {
    if (product == null) {
      this.products = [];
    } else {
      this.products = product;
    }
    this.listChanged.next(this.products.slice());
  }
  getAllProducts() {
    return this.products.slice();
  }
  getSomeProducts(num:number) {
    let listProduct=this.products.slice();
     return listProduct.splice(0,num);  
  }
  getItemPerId(id: number) {
   // console.log(id);
    
    return this.products.slice()[id];
  }
  deleteProduct(id: number) {
    this.products.splice(id, 1);
    this.listChanged.next(this.products.slice());
  }
  addProduct(product: Product) {
    this.products.push(product);
    this.listChanged.next(this.products.slice());
  }
  updateProduct(id: number, product: Product) {
    this.products[id] = product;
    this.listChanged.next(this.products.slice());
  }
  
}
