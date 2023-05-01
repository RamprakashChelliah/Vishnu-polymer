import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LoginDetail } from "../loginDetail";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService{

  constructor(private http: HttpClient){
  }

  registerNewUser(data:any){
    this.http.post("http://localhost:8000/auth/register", {
      email: data.email,
      password: data.psw
    }).subscribe((x) => { return x});
  }
}
