import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from './Service/SharedService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
  title = 'Vishnu-polymers';
  hasLoggedUser = false;
  subscribedStatus: any;

  constructor(private router: Router, private service: SharedService){
    this.subscribedStatus = service.userLoggedStatus.subscribe(x => {
      this.hasLoggedUser = x
    });

    if(!this.hasLoggedUser){
      let email = sessionStorage.getItem("email");
      this.hasLoggedUser = email != null;
    }
  }
  ngOnDestroy(): void {
    this.subscribedStatus.unSubscribe();
  }

  home(){
    this.router.navigateByUrl('');
  }

  navigateTapInfo(){
    this.router.navigateByUrl('tap');
  }

  navigateEntryDetails(){
    this.router.navigateByUrl('record-detail');
  }

  navigateExitDetails(){
    this.router.navigateByUrl('exit-detail');
  }

  logIn(){
    this.router.navigateByUrl('login');
  }

  logOut()
  {
    this.service.logOut();
  }

  // receivedData(event){
  //   this.hasLoggedUser = event;
  //   console.log(event, 456);

  // }
}
