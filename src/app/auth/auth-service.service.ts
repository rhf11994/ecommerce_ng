import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
// import { authResponse } from '../services/dataStorage.service';

export interface authResponse {
  userName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(private http: HttpClient, private router: Router) {}
  userSignUp(email: string, password: string, userName: string) {
    return this.http
      .post<authResponse>('http://localhost:3000/users', {
        userName: userName,
        email: email,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          console.log(resData);
          localStorage.setItem('authUser', JSON.stringify(resData));
          this.router.navigate(['/']);
        })
      );
  }



  login(email: string, password: string) {
    return this.http
      .get<authResponse>('http://localhost:3000/users', {
        params: {
          email: email,
          password: password,
        },
      })
      .pipe(
        catchError(this.handleError),
        tap((authUser) => {
          localStorage.setItem('authUser', JSON.stringify(authUser));
          //this.router.navigate(['/']);
        })
      );
  }


  userLogout() {
    localStorage.removeItem('authUser');
    this.router.navigate(['/']);
  }
  userAuthReload() {
    if (localStorage.getItem('authUser')) {
      this.router.navigate(['/']);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}
