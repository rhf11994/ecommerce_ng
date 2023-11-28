import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { dataStorage } from '../services/dataStorage.service';

import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Injectable({
  providedIn: 'root',
})
export class SellerResolverServiceResolver implements Resolve<Product[]> {
  constructor(
    private dataStorageser: dataStorage,
    private productSer: ProductService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const productList = this.productSer.getAllProducts();

    if (productList.length === 0) {
      return this.dataStorageser.fetchProducts();
    } else {
      return productList;
    }
  }
}
