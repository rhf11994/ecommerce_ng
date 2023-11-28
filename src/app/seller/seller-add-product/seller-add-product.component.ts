import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { dataStorage } from 'src/app/services/dataStorage.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css'],
})
export class SellerAddProductComponent implements OnInit {
  productMsg!: string | undefined;
  id!: number;
  editMode = false;
  
  productItem!: Product;
  productForm!: FormGroup;
  constructor(
    private dataStor: dataStorage,
    private productSer: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((param: Params) => {
      this.id = param['id'];
      this.editMode = this.id != undefined;
      this.onInitForm();
    });
  }

  onSubmit() {
    if (!this.editMode) {
       console.log('onSubmit');
      console.log(this.productForm.value);

      //this.productSer.addProduct(this.productForm.value);

      this.dataStor
        .addProduct(this.productForm.value)
        .subscribe((res: Product) => {
          if (res) {
            
              this.productSer.addProduct(res);
            this.productMsg = 'Product added successfully';
          }
        });
        this.productSer.getAllProducts();
    } else {
      console.log('update');
      
      this.dataStor.updateProduct(this.id, this.productForm.value).subscribe(
        (res)=>{
          this.productSer.updateProduct(this.id,res);
        }
      );
      
    }
    this.router.navigate(['seller-home']);
  }

  // onSubmit() {
  //   this.dataStor
  //     .addProduct(this.productForm.value)
  //     .subscribe((res: Product) => {
  //       if (res) {
  //         this.productMsg = 'Product added successfully';
  //       }
  //     });

  //   this.productForm.reset();
  //   this.router.navigate(['seller-home']);
  // }

  onInitForm() {
    let name = '';
    let price = '';
    let category = '';
    let color = '';
    let description = '';
    let URL = '';
    if (this.editMode) {
      this.productItem = this.productSer.getItemPerId(this.id);
      name = this.productItem.name;
      price = this.productItem.price;
      URL = this.productItem.URL;
      color = this.productItem.color;
      category = this.productItem.category;
      description = this.productItem.description;

      this.productForm = new FormGroup({
        name: new FormControl(name, Validators.required),
        category: new FormControl(category, Validators.required),
        color: new FormControl(color, Validators.required),
        URL: new FormControl(URL, Validators.required),
        price: new FormControl(price, Validators.required),
        description: new FormControl(description, Validators.required),
      });
    } else {
      this.productForm = new FormGroup({
        name: new FormControl(name, Validators.required),
        category: new FormControl(category, Validators.required),
        color: new FormControl(color, Validators.required),
        URL: new FormControl(URL, Validators.required),
        price: new FormControl(price, Validators.required),
        description: new FormControl(description, Validators.required),
      });
    }
  }


}
