import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountsService} from "../services/accounts.service";
import {catchError, Observable, throwError} from "rxjs";
import {AccountDetails} from "../model/acoount.model";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit{

  accountFormGroup! : FormGroup;
  currentPage : number = 0;
  pageSize : number = 5;
  accountObservable! : Observable<AccountDetails>;
  operationFormGroup! : FormGroup;
  errorMessage! : string;


  constructor(private formBuilder : FormBuilder, private accountService : AccountsService) {
  }
  ngOnInit(): void {
    this.accountFormGroup = this.formBuilder.group({
      accountId : this.formBuilder.control("")
    });

    this.operationFormGroup = this.formBuilder.group({
      operationType : this.formBuilder.control(null),
      amount: this.formBuilder.control(0),
      description: this.formBuilder.control(null),
      accountDestination: this.formBuilder.control(null),
    });
  }

  handleSearchAccount() {

    let accountId = this.accountFormGroup.value.accountId;

    this.accountObservable = this.accountService.getAccount(accountId, this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );

  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();
  }

  handleAccountOperation() {

    let accountId : string = this.accountFormGroup.value.accountId;
    let operationType : string = this.operationFormGroup.value.operationType;
    let amount : number = this.operationFormGroup.value.amount;
    let description : string = this.operationFormGroup.value.description;
    let accountDestination : string = this.operationFormGroup.value.accountDestination;

    if(operationType == "DEBIT"){
      this.accountService.debit(accountId, amount, description).subscribe({
        next : (data) =>{
          alert("Debit success")
          this.handleSearchAccount();
          this.operationFormGroup.reset();
        },
        error : err => {
          console.log(err);
        }
      });
    }else if(operationType == "CREDIT"){
      this.accountService.credit(accountId, amount, description).subscribe({
        next : (data) =>{
          alert("Credit success")
          this.handleSearchAccount();
          this.operationFormGroup.reset();
        },
        error : err => {
          console.log(err);
        }
      });
    }else if(operationType == "TRANSFER"){
      this.accountService.transfer(accountId, accountDestination, amount).subscribe({
        next : (data) =>{
          alert("Transfer success")
          this.handleSearchAccount();
          this.operationFormGroup.reset();
        },
        error : err => {
          console.log(err);
        }
      });
    }
  }
}
