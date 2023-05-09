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
    if(window.innerWidth <= 480) this.closeMenu();
  }

  navigateTapInfo(){
    this.router.navigateByUrl('tap');
    if(window.innerWidth <= 480) this.closeMenu();
  }

  navigateEntryDetails(){
    this.router.navigateByUrl('record-detail');
    if(window.innerWidth <= 480) this.closeMenu();
  }

  navigateExitDetails(){
    this.router.navigateByUrl('exit-detail');
    if(window.innerWidth <= 480) this.closeMenu();
  }

  logIn(){
    this.router.navigateByUrl('login');
    if(window.innerWidth <= 480) this.closeMenu();
  }

  logOut()
  {
    this.service.logOut();
  }

  closeMenu(){
    let menu_checkbox = document.getElementById('menu') as HTMLInputElement;
    menu_checkbox.checked = false;
  }
  // receivedData(event){
  //   this.hasLoggedUser = event;
  //   console.log(event, 456);

  // }
}
