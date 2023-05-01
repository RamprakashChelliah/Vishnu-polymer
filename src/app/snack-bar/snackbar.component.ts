import { Component} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'snack-bar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent{

  constructor(private _snackbar: MatSnackBar){

  }

  openSnackbar(message){
    this._snackbar.open(message, 'close', {
      duration: 4000
    });
  }
}
