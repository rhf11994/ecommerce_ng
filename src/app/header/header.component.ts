import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { dataStorage } from '../services/dataStorage.service';
import { Product } from '../models/product.model';
import { AuthServiceService } from '../auth/auth-service.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  sellerName!: any;
  searchResult: undefined | Product[];
  showList = false;

  userName!: string;

  cartItemNum!: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataStor: dataStorage,
    private authSer: AuthServiceService,
    private cartSer: CartService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((res: any) => {
      if (res.url) {
        if (localStorage.getItem('resData') && res.url.includes('seller')) {
          //get username
          let sellerStore = localStorage.getItem('resData');
          let sellerData = sellerStore && JSON.parse(sellerStore)[0];
          this.sellerName = sellerData.userName;

          this.menuType = 'seller';
        } else if (localStorage.getItem('authUser')) {
          let userStore = localStorage.getItem('authUser');
          let userData = userStore && JSON.parse(userStore)[0];
          this.userName = userData.userName;
          this.menuType = 'user';
        } else {
          this.menuType = 'default';
        }
      }
    });

    ////cartPart//////
    this.cartSer.checkCartNumber();
    this.cartSer.listChanged.subscribe((res: any) => {
      this.cartItemNum = res.length;
    });
    ////cartPartEnd//////
  }

  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;

      this.dataStor.searchProduct(element.value).subscribe((result) => {
        if (result.length > 5) {
          result.length = 5;
        }
        this.searchResult = result;
      });
    }
  }

  hideSearch() {
    this.searchResult = undefined;
  }

  submitSearch(query: string) {
    console.log(query);
    if (query.length > 0) {
      this.router.navigate(['search/', query]);
    } else {
      return;
    }
  }
  redirectToDetails(id: number) {
    this.router.navigate(['/', id, 'details']);
  }

  onUserLogout() {
    this.authSer.userLogout();
    this.cartSer.listChanged.next([]);
  }
  onLogout() {
    this.dataStor.Logout();
    this.cartSer.listChanged.next([]);
  }
}
