import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SellerAuthComponent } from './seller/seller-auth/seller-auth.component';

import { AuthGuard } from './guards/auth.guard';
import { SellerHomeComponent } from './seller/seller-home/seller-home.component';
import { SellerAddProductComponent } from './seller/seller-add-product/seller-add-product.component';
import { SellerResolverServiceResolver } from './seller/sellerResolver.resolver';
import { SearchComponent } from './search/search.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AuthComponent } from './auth/auth.component';
import { CartResolver } from './home/cart.resolver';
import { CartPageComponent } from './cart-page/cart-page.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
// import { CartResolver } from './home/cart.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    resolve: [SellerResolverServiceResolver, CartResolver],
  },

  { path: 'seller-auth', component: SellerAuthComponent },
  {
    path: 'seller-home',
    component: SellerHomeComponent,
    canActivate: [AuthGuard],
    resolve: [SellerResolverServiceResolver],
  },

  {
    path: 'seller-add',
    component: SellerAddProductComponent,
    canActivate: [AuthGuard],
    resolve: [SellerResolverServiceResolver],
  },
  {
    path: 'seller/:id',
    component: SellerAddProductComponent,
    canActivate: [AuthGuard],
    resolve: [SellerResolverServiceResolver],
  },

  { path: 'search/:query', component: SearchComponent },
  {
    path: ':id/details',
    component: ProductDetailComponent,
    resolve: [SellerResolverServiceResolver, CartResolver],
  },
  {
    path: 'cart',
    component: CartPageComponent,
    resolve: [CartResolver],
  },
  {
    path: 'checkout',
    component: CheckOutComponent,
    resolve: [CartResolver],
  },
  {
    path: 'myorder',
    component: MyOrdersComponent,
  },

  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
