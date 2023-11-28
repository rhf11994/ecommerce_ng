import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { authResponse, dataStorage } from '../../services/dataStorage.service';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css'],
})
export class SellerAuthComponent implements OnInit {
  //showLogin = false;

  loggedIn = false;
  isLoading = false;
  error:any = null;
  authObesrv!: Observable<authResponse>;
  constructor(private router: Router, private dataStor: dataStorage) {}

  ngOnInit() {
    this.dataStor.reloadSeller();
  }

  login() {
    this.loggedIn = true;
  }
  signUp() {
    this.loggedIn = false;
  }
  OnLogin(form: NgForm) {
    console.log(form.value);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    if (this.loggedIn) {
      this.authObesrv = this.dataStor.login(email, password);
    }

    this.subscribeAuth();
  }
  OnSubmit(form: NgForm) {
    console.log(form.value);
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const userName = form.value.userName;
    const password = form.value.password;
    this.authObesrv = this.dataStor.userSignUp(email, password, userName);
    this.subscribeAuth();
    
    form.reset();
  }
  subscribeAuth() {
    this.authObesrv.subscribe(
      (response:any) => {
        
        if (response && response.length>0) {
          console.log(response);
          this.router.navigate(['/seller-home']);
        }
        else{
          this.error='un correct username or password';
        }
       
       }
    );
  }
}
