import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { dataStorage } from '../services/dataStorage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  sliderProduct!: Product[];
  trendyProducts!: Product[];
  constructor(
    private dataStorSer: dataStorage,
    private productSer: ProductService
  ) {}
  ngOnInit() {
    this.sliderProduct = this.productSer.getSomeProducts(3);
    this.trendyProducts = this.productSer.getSomeProducts(6);
  }

  getColor(item: Product) {
    return item.color;
  }
}
