import { Component, OnInit } from '@angular/core';
import { dataStorage } from '../services/dataStorage.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { CartDataStorageService } from '../services/cart-data-storage.service';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  productQuantity: number = 1;
  showRemove = false;
  id!: number;

  listOfCurrentProduct!: Product[];
  listOfCurrentCart!: Cart[];
  constructor(
    private productSer: ProductService,
    private cartSer: CartService,
    private cartDBSer: CartDataStorageService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const productIdFromRoute = Number(paramMap.get('id'));
      this.id = productIdFromRoute;
      this.product = this.productSer.getItemPerId(productIdFromRoute);

      ////cartPart//////
      //this.cartSer.checkCartNumber();
      let userStore = localStorage.getItem('authUser');
      let userData = userStore && JSON.parse(userStore)[0];

      if (!userStore) {
        this.listOfCurrentProduct = this.cartSer
          .getAllCartItemsLocal()
          .filter((item: Product) => item.id === this.product.id);

        this.showRemove = this.listOfCurrentProduct.length ? true : false;
      } else {
 
        this.listOfCurrentCart = this.cartSer
          .getAllCartItems()
          .filter((item: Cart) => item.ProductId === this.product.id);

        this.showRemove = this.listOfCurrentCart.length ? true : false;
      }

      ////cartPartEnd//////
    });
  }

  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity++;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity--;
    }
  }

  addToCartProduct() {
    let userStore = localStorage.getItem('authUser');
    let userData = userStore && JSON.parse(userStore)[0];
    if (!userStore) {
      //add to lacal storage (not auth)
      this.product.quantity=this.productQuantity;
      this.cartSer.addCartItemLocal(this.product);
      // this.showRemove = true;
    } else {
      //add to DB (auth)
      let authcartItem: Cart = {
        ...this.product,
        quantity:this.productQuantity,
        userId: userData.id,
        ProductId: this.product.id,
      };
      delete authcartItem.id;

      setTimeout(() => {
        this.cartDBSer.addToCartOnLogIn(authcartItem).subscribe();
      }, 500);
    }

    this.showRemove = true;
  }

  onRemoveFromCart(id: number) {
    let userStore = localStorage.getItem('authUser');
    let userData = userStore && JSON.parse(userStore)[0];

    if (!userStore) {
      let listOfDeleteItems = this.cartSer
        .getAllCartItemsLocal()
        .filter((item: Product) => item.id !== this.product.id);

      this.cartSer.deleteCartItemLocal(listOfDeleteItems);
      this.showRemove = false;
    } else {
    
      
      let listOfDeleteItems = this.cartSer
        .getAllCartItems()
        .filter((item: Cart) => item.ProductId === this.product.id);
      
        console.log('listOfDeleteItems');
        console.log(listOfDeleteItems);
        
        
      let arr: any[] = [];
      listOfDeleteItems.forEach((element) => {
        arr.push(element.id);
      });
     
      setTimeout(() => {
        this.cartDBSer.removeFromCartAfterLogIn(arr);
      }, 500);

       this.showRemove = false;
    }
  }
}
