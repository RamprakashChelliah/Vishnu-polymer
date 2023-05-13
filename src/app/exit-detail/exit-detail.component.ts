import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../Service/SharedService';
import { Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SnackbarComponent } from '../snack-bar/snackbar.component';

@Component({
  selector: 'exit-detail',
  templateUrl: './exit-detail.component.html',
  styleUrls: ['./exit-detail.component.scss']
})
export class ExitDetailComponent implements OnInit, OnDestroy{
  addEntry = false;
  exitDetail: FormGroup;
  searchForm: FormGroup;
  listDatas: any;
  amount= 0;
  hasAnyChanges = false;
  originalValue: any;
  hasShowAddButton: boolean;
  hasLoggedUser = false;
  subscribedStatus: Subscription;
  responseMessage: any;
  tapDetails: any;

  constructor(private service: SharedService, private http: HttpClient,
    private snackbar: SnackbarComponent){
    this.listDatas = [];
    this.subscribedStatus = service.userLoggedStatus.subscribe(x => {
      this.hasLoggedUser = x
    });

    this.subscribedStatus = service.tapList.subscribe(x => {
      this.tapDetails = x
    });

    if(!this.hasLoggedUser){
      let email = sessionStorage.getItem("email");
      this.hasLoggedUser = email != null;
    }
  }

  ngOnInit(){
    this.http.get("https://vishnu-polymer-api.onrender.com/exits").subscribe(x => {
      this.listDatas = x,
      this.listDatas.forEach(element => {
        let tapType = this.tapDetails.find(x => x.tapType == element.tapType);
        element.tapType = tapType.tapName;
      });
    });

    this.hasShowAddButton = true;
    this.FormInitialize();
  }

  ngOnDestroy(){
    this.subscribedStatus.unsubscribe();
  }

  onClickAdd(){
    this.addEntry = true;
  }

  addNewEntry(){
    var hasAnyError = false;
    this.addEntry = false;

    var tapDetail = this.tapDetails.find(x => x.tapType === this.exitDetail.value.tapType)

    if(tapDetail === null)return;

    if(this.exitDetail.value.quantity >= 1){
      this.exitDetail.value.amount = tapDetail.amount * this.exitDetail.value.quantity
    }

    this.http.post<any>("https://vishnu-polymer-api.onrender.com/exits", {
      tapType: tapDetail.tapType,
      tapName: this.exitDetail.value.tapName,
      date: this.exitDetail.value.date,
      receiver: this.exitDetail.value.receiver,
      quantity: this.exitDetail.value.quantity,
      amount: this.exitDetail.value.amount
    }).subscribe(x => {
      this.responseMessage = x,
      this.snackbar.openSnackbar(this.responseMessage);
        (err) => {
          hasAnyError = true,
          this.responseMessage = err.error,
          this.snackbar.openSnackbar(this.responseMessage);
        }
      });

    if(hasAnyError) return;

    this.exitDetail.value.id = this.listDatas.length + 1;
    this.listDatas.push(this.exitDetail.value);
    this.FormInitialize();
  }

  closeForm(){
    if(JSON.stringify(this.originalValue) === JSON.stringify(this.exitDetail.value)){
      this.addEntry = false;
    }
    else{
      this.hasAnyChanges = true;
    }
  }

  onOk(){
    this.hasAnyChanges = false;
    this.addEntry = false;
    this.FormInitialize();
  }

  onCancel(){
    this.hasAnyChanges = false;
  }

  FormInitialize(){
    this.exitDetail = new FormGroup({
      id: new FormControl(),
      tapType: new FormControl('', Validators.required),
      tapName: new FormControl('', Validators.required),
      receiver: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
    });

    this.searchForm = new FormGroup({
      search: new FormControl('')
    });

    this.searchForm.get('search').valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(s => this.http.get('https://vishnu-polymer-api.onrender.com/exits', {
        params:
        {
          "searchText": s
        }
      }))
    ).subscribe(x => {this.listDatas = x});

    this.originalValue = this.exitDetail.getRawValue();

    this.exitDetail.get('quantity').valueChanges.subscribe({next : (value => {
      if(!value){
        this.amount = 0
        return;
      }
      var tapDetail = this.tapDetails.find(x => x.tapType === this.exitDetail.value.tapType)

      if(tapDetail === null) return;

      if(this.exitDetail.value.quantity >= 1){
        this.amount = tapDetail.amount * this.exitDetail.value.quantity
      }
    })})
  }

  OnEdit(id){
    let existData = this.listDatas.find(x => x.id === id);

    if(existData != null){
      this.exitDetail.get('id').setValue(existData.id);
      this.exitDetail.get('tapType').setValue(existData.tapType);
      this.exitDetail.get('tapName').setValue(existData.tapName);
      this.exitDetail.get('receiver').setValue(existData.receiver);
      this.exitDetail.get('date').setValue(existData.date);
      this.exitDetail.get('quantity').setValue(existData.quantity);

      this.amount = existData.amount;
      this.addEntry = true;
      this.hasShowAddButton = false;
    }
  }

  UpdateEntry(){
    var hasAnyError = false;
    this.addEntry = false;

    var tapDetail = this.tapDetails.find(x => x.tapType === this.exitDetail.value.tapType)

    if(tapDetail === null)return;

    if(this.exitDetail.value.quantity >= 1){
      this.exitDetail.value.amount = tapDetail.amount * this.exitDetail.value.quantity
    }

    this.http.put<any>("https://vishnu-polymer-api.onrender.com/exits/" + this.exitDetail.value.id, {
      tapName: this.exitDetail.value.tapName,
      date: this.exitDetail.value.date,
      quantity: this.exitDetail.value.quantity,
      receiver: this.exitDetail.value.receiver,
      amount: this.exitDetail.value.amount
    }).subscribe(x => {
      this.responseMessage = x,
      this.snackbar.openSnackbar(this.responseMessage);
        (err) => {
          hasAnyError = true,
          this.responseMessage = err.error,
          this.snackbar.openSnackbar(this.responseMessage);
        }
      });

    if(hasAnyError) return;

    let existData = this.listDatas.find(x => x.id === this.exitDetail.value.id);

    if(existData != null){
      existData.tapName = this.exitDetail.value.tapName;
      existData.tapType = this.exitDetail.value.tapType;
      existData.receiver = this.exitDetail.value.receiver;
      existData.amount = this.exitDetail.value.amount;
      existData.quantity = this.exitDetail.value.quantity;
      existData.date = this.exitDetail.value.date;
    }
    this.FormInitialize();
  }

  DeleteEntry(id){
    var hasAnyError = false;
    this.http.delete<any>("https://vishnu-polymer-api.onrender.com/exits/" + id).subscribe(x => {
      this.responseMessage = x,
      this.snackbar.openSnackbar(this.responseMessage);
        (err) => {
          hasAnyError = true,
          this.responseMessage = err.error,
          this.snackbar.openSnackbar(this.responseMessage);
        }
      });

    if(hasAnyError) return;

    let existData = this.listDatas.find(x => x.id == id);
    if(existData != null){
      var isExistIndexData = this.listDatas.indexOf(existData);
      this.listDatas.splice(isExistIndexData);
    }
  }
}

