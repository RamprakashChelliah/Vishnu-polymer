import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../Service/SharedService';
import { Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SnackbarComponent } from '../snack-bar/snackbar.component';

@Component({
  selector: 'record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.scss']
})
export class RecordDetailComponent implements OnInit, OnDestroy{
  addEntry = false;
  entryDetail: FormGroup;
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
    this.http.get("http://localhost:8000/entries").subscribe(x => {
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

    var tapDetail = this.tapDetails.find(x => x.tapType === this.entryDetail.value.tapType)

    if(tapDetail === null)return;

    if(this.entryDetail.value.quantity >= 1){
      this.entryDetail.value.amount = tapDetail.amount * this.entryDetail.value.quantity
    }

    this.http.post<any>("http://localhost:8000/entries", {
      tapType: tapDetail.tapType,
      tapName: this.entryDetail.value.tapName,
      date: this.entryDetail.value.date,
      quantity: this.entryDetail.value.quantity,
      amount: this.entryDetail.value.amount
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

    this.entryDetail.value.id = this.listDatas.length + 1;
    this.listDatas.push(this.entryDetail.value);
    this.FormInitialize();
  }

  closeForm(){
    if(JSON.stringify(this.originalValue) === JSON.stringify(this.entryDetail.value)){
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
    this.entryDetail = new FormGroup({
      id: new FormControl(),
      tapType: new FormControl('', Validators.required),
      tapName: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
    });

    this.searchForm = new FormGroup({
      search: new FormControl('')
    });

    this.searchForm.get('search').valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(s => this.http.get('http://localhost:8000/entries', {
        params:
        {
          "searchText": s
        }
      }))
    ).subscribe(x => {this.listDatas = x});

    this.originalValue = this.entryDetail.getRawValue();

    this.entryDetail.get('quantity').valueChanges.subscribe({next : (value => {
      if(!value){
        this.amount = 0
        return;
      }
      var tapDetail = this.tapDetails.find(x => x.tapType === this.entryDetail.value.tapType)

      if(tapDetail === null) return;

      if(this.entryDetail.value.quantity >= 1){
        this.amount = tapDetail.amount * this.entryDetail.value.quantity
      }
    })})
  }

  OnEdit(id){
    let existData = this.listDatas.find(x => x.id === id);

    if(existData != null){
      this.entryDetail.get('id').setValue(existData.id);
      this.entryDetail.get('tapType').setValue(existData.tapType);
      this.entryDetail.get('tapName').setValue(existData.tapName);
      this.entryDetail.get('date').setValue(existData.date);
      this.entryDetail.get('quantity').setValue(existData.quantity);

      this.amount = existData.amount;
      this.addEntry = true;
      this.hasShowAddButton = false;
    }
  }

  UpdateEntry(){
    var hasAnyError = false;
    this.addEntry = false;

    var tapDetail = this.tapDetails.find(x => x.tapType === this.entryDetail.value.tapType)

    if(tapDetail === null)return;

    if(this.entryDetail.value.quantity >= 1){
      this.entryDetail.value.amount = tapDetail.amount * this.entryDetail.value.quantity
    }

    this.http.put<any>("http://localhost:8000/entries/" + this.entryDetail.value.id, {
      tapName: this.entryDetail.value.tapName,
      date: this.entryDetail.value.date,
      quantity: this.entryDetail.value.quantity,
      amount: this.entryDetail.value.amount
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

    let existData = this.listDatas.find(x => x.id === this.entryDetail.value.id);

    if(existData != null){
      existData.tapName = this.entryDetail.value.tapName;
      existData.tapType = this.entryDetail.value.tapType;
      existData.amount = this.entryDetail.value.amount;
      existData.quantity = this.entryDetail.value.quantity;
      existData.date = this.entryDetail.value.date;
    }
    this.FormInitialize();
  }

  DeleteEntry(id){
    var hasAnyError = false;
    this.http.delete<any>("http://localhost:8000/entries/" + id).subscribe(x => {
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
