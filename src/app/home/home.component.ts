import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../Service/SharedService';
import { Observable, Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{
  title = 'Vishnu-polymers';
}
