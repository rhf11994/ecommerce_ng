import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { dataStorage } from 'src/app/services/dataStorage.service';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent implements OnInit {
  @Input() productItem!: Product;
  @Input() itemId!: number;

  productId!: number;
  colorbox!: any;

  constructor(
    private dataStorage: dataStorage,
    private router: Router
  ) {}
  ngOnInit() {}
  getColor() {
    return this.productItem.color;
    // return this.colorbox=this.productItem.color? this.productItem.color:'white';
  }
  onDeleteProduct() {
    console.log(this.itemId);
    
    this.dataStorage.deleteProduct(this.itemId);
  }
  onUpdateProduct() {
     console.log(this.itemId);
    // this.sellerSer.updateProduct(this.itemId,this.productItem);
    // this.sellerSer.selectedItem.next(this.itemId);
    this.router.navigate(['seller', this.itemId]);
   
  }
}
