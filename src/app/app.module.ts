import { NgModule } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog'
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { routes } from './app.routing';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { TapComponent } from './Tap/tap.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar'
import { SnackbarComponent } from './snack-bar/snackbar.component';
import { ExitDetailComponent } from './exit-detail/exit-detail.component';

@NgModule({
  declarations: [
    AppComponent, HomeComponent, RecordDetailComponent, TapComponent, LoginComponent, SnackbarComponent,
    ExitDetailComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    FormsModule, MatMenuModule, MatButtonModule, MatToolbarModule, MatCardModule, MatFormFieldModule,
    ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatIconModule,
     RouterModule.forRoot(routes), HttpClientModule, MatSnackBarModule
  ],
  providers: [SnackbarComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
