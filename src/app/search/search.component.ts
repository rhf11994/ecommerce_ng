import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { dataStorage } from '../services/dataStorage.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  queryParam!:string;
  searchResult!:Product[];
  constructor(private route:ActivatedRoute,private dataStor:dataStorage){}
  ngOnInit() {
    
    this.route.params.subscribe((param:Params)=>{
      this.queryParam=param['query'];
      //console.log(this.queryParam);
     this.queryParam&&
  
        this.dataStor.searchProduct(this.queryParam).subscribe((result) => {
          this.searchResult = result;
        })
      });
  }
}

