import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../Service/SharedService';
import { Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SnackbarComponent } from '../snack-bar/snackbar.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'tap',
  templateUrl: './tap.component.html',
  styleUrls: ['./tap.component.scss']
})
export class TapComponent implements OnInit{
  title = 'Vishnu-polymers';
  addTap = false;
  tapInfo: FormGroup;
  searchForm: FormGroup;
  listDatas: any;
  amount = 0;
  hasAnyChanges = false;
  hasChange = false;
  hasShowAddButton : boolean;
  originalValue: any;
  hasLoggedUser = false;
  subscribedStatus: Subscription;
  responseMessage: any;
  searchText: any;

  constructor(private service: SharedService, private http: HttpClient,
    private snackbar: SnackbarComponent){
    this.listDatas = [];
    this.subscribedStatus = service.userLoggedStatus.subscribe(x => {
      this.hasLoggedUser = x
    });

    if(!this.hasLoggedUser){
      let email = sessionStorage.getItem("email");
      this.hasLoggedUser = email != null;
    }
  }

  ngOnInit(){
    this.http.get('http://localhost:8000/taps')
    .subscribe(x => this.listDatas = x)
    this.hasShowAddButton = true;
    this.FormInitialize();
  }

  ngOnDestroy(): void {
    this.subscribedStatus.unsubscribe();
  }

  onClickAdd(){
    this.addTap = true;
  }

  addNewTap(){
    var hasAnyError = false;
    var responseData: any;
    this.http.post<any>("http://localhost:8000/taps", {
      tapType: this.tapInfo.value.tapType,
      tapName: this.tapInfo.value.tapName,
      amount: this.tapInfo.value.amount
    }).subscribe(x => {
      responseData = x,
      this.listDatas.push(responseData);
      this.snackbar.openSnackbar("Tap details added successfully!");
        (err) => {
          hasAnyError = true,
          this.responseMessage = err.error,
          this.snackbar.openSnackbar(this.responseMessage);
        }
      });

    if(hasAnyError) return;
    this.addTap = false;
    this.FormInitialize();
  }

  closeTap(){
    if(JSON.stringify(this.originalValue) === JSON.stringify(this.tapInfo.getRawValue())){
      this.addTap = false;
    }
    else{
      this.hasAnyChanges = true;
    }
  }

  onOk(){
    this.hasChange = false;
    this.hasAnyChanges = false;
    this.addTap = false;
    this.FormInitialize();
  }

  onCancel(){
    this.hasAnyChanges = false;
  }

  FormInitialize(){
    this.tapInfo = new FormGroup({
      id: new FormControl(),
      tapType: new FormControl('', Validators.required),
      tapName: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
    });

    this.searchForm = new FormGroup({
      search: new FormControl('')
    })

    this.searchForm.get('search').valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(s => this.http.get('http://localhost:8000/taps', {
        params:
        {
          "searchText": s
        }
      }))
    ).subscribe(x => {this.listDatas = x, console.log(x)})

    this.originalValue = this.tapInfo.getRawValue();
  }

  onSearch(){

  }

  OnEdit(id){
    let existData = this.listDatas.find(x => x.id == id);

    if(existData != null){
      this.tapInfo.get('id').setValue(existData.id);
      this.tapInfo.get('tapType').setValue(existData.tapType);
      this.tapInfo.get('tapName').setValue(existData.tapName);
      this.tapInfo.get('amount').setValue(existData.amount);

      this.addTap = true;
      this.hasShowAddButton = false;
    }
  }

  UpdateTap(){
    this.addTap = false;
    if(this.tapInfo.value.quantity >= 1){
      this.tapInfo.value.amount = 100 * this.tapInfo.value.quantity
    }
    let existData = this.listDatas.find(x => x.id == this.tapInfo.value.id);

    if(existData != null){
      existData.tapType = this.tapInfo.value.tapType;
      existData.amount = this.tapInfo.value.amount;
      existData.tapName = this.tapInfo.value.tapName;
    }
    this.FormInitialize();
  }

  DeleteEntry(id){
    var hasAnyError = false;
    this.http.delete<any>("http://localhost:8000/taps/" + id).subscribe(x => {
      this.responseMessage = x,
      this.snackbar.openSnackbar(this.responseMessage);
        (err) => {
          hasAnyError = true,
          this.responseMessage = err.error,
          this.snackbar.openSnackbar(this.responseMessage);
        }
      });

    if(hasAnyError) return;

    let existData = this.listDatas.find(x => x.id === id);
    if(existData != null){
      var isExistIndexData = this.listDatas.indexOf(existData);
      this.listDatas.splice(isExistIndexData);
    }
  }
}
