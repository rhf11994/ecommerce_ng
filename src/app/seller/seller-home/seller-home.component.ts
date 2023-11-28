import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  AllProducts!: Product[];
  
  constructor(private productSer: ProductService) {}
  ngOnInit() {
    this.AllProducts = this.productSer.getAllProducts();

    this.productSer.listChanged.subscribe((res:any) => {
      // console.log(res);
      this.AllProducts =res;
    });
  }
}
