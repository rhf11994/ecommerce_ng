import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import {  dataStorage } from '../services/dataStorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private dataStor: dataStorage, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      
    if (localStorage.getItem('resData')) {
      return true;
    }
    return this.dataStor.user;
    // return this.dataStor.user.pipe(
    //   take(1),
    //   map((user) => {
    //     console.log(user);

    //     const isAuth = !!user;
    //     if (isAuth) {
    //       return true;
    //     }
    //     return this.router.createUrlTree(['/seller-auth']);
    //   })
    
    // );
  }
}
