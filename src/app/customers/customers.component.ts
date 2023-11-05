import {Component, OnInit} from '@angular/core';
import {CustomerService} from "../services/customer.service";
import {catchError, map, Observable, throwError} from "rxjs";
import {Customer} from "../model/customer.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit{

  customers! : Observable<Array<Customer>>;
  errorMessage! : string;
  searchFormGroup : FormGroup | undefined;

  constructor(private customersService : CustomerService,
              private formBuilder : FormBuilder,
              private router : Router) {
  }

  ngOnInit(): void {
    /*
    this.customersService.getCustomers().subscribe({
      next : (data)=>{
        this.customers = data;
      },
      error : err => {
        this.errorMessage = err.message;
      }
    });
    */

    this.searchFormGroup = this.formBuilder.group({
      keyword : this.formBuilder.control("")
    })

    this.handleSearchCustomers();
  }


  handleSearchCustomers() {
    let keyword = this.searchFormGroup?.value.keyword;
    this.customers = this.customersService.searchCustomers(keyword).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }

  handleDeleteCustomer(customer : Customer) {

    let confirmation = confirm("Are you sur to confirm ?")

    if (!confirmation) return;

    this.customersService.deleteCustomer(customer.id).subscribe({
      next : (res) =>{
        this.customers = this.customers.pipe(
          map(data =>{
            let index = data.indexOf(customer);
            data.slice(index, 1);
            return data;
          })
        );
      },
      error : err => {
        console.log(err);
      }
    })
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl("/customer-accounts/"+customer.id, {state : customer});
  }
}
