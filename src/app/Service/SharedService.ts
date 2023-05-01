import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LoginDetail } from "../loginDetail";
import { SnackbarComponent } from "../snack-bar/snackbar.component";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SharedService{
  hasLoggedUser = new BehaviorSubject<boolean>(false);
  userLoggedStatus = this.hasLoggedUser.asObservable();
  tapDetails = new BehaviorSubject<any>([]);
  tapList = this.tapDetails.asObservable();

  constructor(private snackbar: SnackbarComponent, private http: HttpClient){
    var email = sessionStorage.getItem("email");
    if(email != null){
      this.http.get('http://localhost:8000/taps')
    .subscribe(x => this.tapDetails.next(x))
    }
  }

  SetUserLoginStatus(value:boolean, email:string){
    this.hasLoggedUser.next(value);
    sessionStorage.setItem("email", email);

    this.http.get('http://localhost:8000/taps')
    .subscribe(x => this.tapDetails.next(x))
  }

  logOut(){
    let email = sessionStorage.getItem('email');

    if(email != null){
      this.hasLoggedUser.next(false);
      sessionStorage.removeItem("email");
      this.snackbar.openSnackbar("Logged out successfully!");
    }
    else{
      this.snackbar.openSnackbar("User already logged out!");
    }
  }

  checkUserCurrentlyLogged(){
    let email = sessionStorage.getItem('email');

    return email != null;
  }
}
