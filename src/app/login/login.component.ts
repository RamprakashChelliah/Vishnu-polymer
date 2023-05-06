import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../Service/SharedService';
import { HttpClient } from '@angular/common/http';
import { SnackbarComponent } from '../snack-bar/snackbar.component';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{
  title = 'Vishnu-polymers';
  hasLogin = true;
  hasCreateAccount = false;
  hasChangePassword = false;
  loginInfo: FormGroup;
  signUpInfo: FormGroup;
  userInfo: FormGroup;
  responseMessage: any;

  constructor(private fb:FormBuilder, private router: Router, private service: SharedService,
     private http: HttpClient, private snackbar: SnackbarComponent){

      this.loginInfo = this.fb.group({
        email: ['', Validators.required],
        psw: ['', Validators.required],
      })

      this.signUpInfo = this.fb.group({
        username: ['', Validators.required],
        email: ['', Validators.required],
        psw: ['', Validators.required],
      })

      this.userInfo = this.fb.group({
        email: ['', Validators.required],
        psw: ['', Validators.required],
      })

    let existData = this.service.checkUserCurrentlyLogged();
    if(existData === true)this.router.navigateByUrl("");
  }

  onCloseWindow(){
   this.router.navigateByUrl("");
  }

  login(){
    var hasAnyError = false;
    this.http.post<any>("http://localhost:8000/auth/login", {
      email: this.loginInfo.value.email,
      password: this.loginInfo.value.password
    }).subscribe(x => {
      this.responseMessage = x,
      this.snackbar.openSnackbar(this.responseMessage);
        (err) => {
          hasAnyError = true,
          this.responseMessage = err.error,
          this.snackbar.openSnackbar(this.responseMessage);
        }
      });

      if(hasAnyError){
        return;
      }

    this.hasLogin = false;
    if(sessionStorage.getItem('email') != this.loginInfo.value.email){
      this.service.SetUserLoginStatus(true, this.loginInfo.value.email);
    }
    this.loginInfo.reset();
    this.router.navigateByUrl("");
  }

  createAccount(){
    var hasAnyError = false;
    this.http.post<any>("http://localhost:8000/auth/register", {
      email: this.signUpInfo.value.email,
      password: this.signUpInfo.value.psw
    }).subscribe(x => {
      this.responseMessage = x,
      this.snackbar.openSnackbar(this.responseMessage);
        (err) => {
          hasAnyError = true,
          this.responseMessage = err.error,
          this.snackbar.openSnackbar(this.responseMessage);
        }
      });


    if(hasAnyError){
      return;
    }

    this.hasCreateAccount = false;
    if(sessionStorage.getItem('email') != this.signUpInfo.value.email){
      this.service.SetUserLoginStatus(true, this.signUpInfo.value.email);
    }
  }

  changePassword(){
    var hasAnyError = false;
    this.http.put<any>("http://localhost:8000/auth/password-reset", {
      email: this.userInfo.value.email,
      password: this.userInfo.value.psw
    }).subscribe(x => {
      this.responseMessage = x,
      this.snackbar.openSnackbar(this.responseMessage);
        (err) => {
          hasAnyError = true,
          this.responseMessage = err.error,
          this.snackbar.openSnackbar(this.responseMessage);
        }
      });

    if(hasAnyError){
      return;
    }
    this.hasChangePassword = false;
    this.navigateLogin();
  }

  navigateLogin(){
    this.hasCreateAccount = false;
    this.hasLogin = true;
  }

  navigateToCreateAccount(){
    this.hasCreateAccount = true;
    this.hasLogin = false;
  }

  navigateToChangePassword(){
    this.hasCreateAccount = false;
    this.hasLogin = false;
    this.hasChangePassword = true;
  }

}
