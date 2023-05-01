import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { TapComponent } from './Tap/tap.component';
import { ExitDetailComponent } from './exit-detail/exit-detail.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'record-detail', component: RecordDetailComponent
  },
  {
    path: 'exit-detail', component: ExitDetailComponent
  },
  {
    path: 'tap', component: TapComponent
  },
  {
    path: 'login', component: LoginComponent
  }
]
