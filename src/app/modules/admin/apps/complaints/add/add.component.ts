import {Component, inject, OnInit} from '@angular/core';
import { NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import {TranslocoPipe} from "@ngneat/transloco";
import {LoadingService} from "../../../../../shared/services/loading.service";
import { ComplaintService } from 'app/shared/services/complaint.service';
import { Complaint } from 'app/shared/models/complaint';
import { ProductService } from 'app/shared/services/product.service';
import { Product } from 'app/shared/models/product';
import { MatSelectModule } from '@angular/material/select';
import { Pagination } from 'app/shared/models/pagination';
import { FilterOptions } from 'app/shared/models/filter-options';
import jsPDF from 'jspdf';
import { MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-details',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations,
    imports: [
      MatDialogModule,
        FormsModule,
        MatButton,
        MatFormField,
        MatLabel,
        MatInput,
        MatError,
        ReactiveFormsModule,
        TranslocoPipe,
        MatSelectModule
    ],
})
export class AddComponent implements OnInit {

  showDischargeModal = false;

  filterOptions: FilterOptions = new FilterOptions();
    currentSize = 10;
    currentPage = 1;
    displayedList: Pagination<Product>;
    typingTimer;
    doneTypingInterval = 500;
    isScreenSmall: boolean;
    //************* FILTERS *****************//
    openFilter = false;
    filterType: string[] = [];
    filterStatus: string[] = [];
    filterSearch: string;

 
  
    //********* INJECT SERVICES ***********//
   _complaintService= inject(ComplaintService);
   _productService = inject(ProductService)
    _router= inject(Router);
    _fuseConfirmationService= inject(FuseConfirmationService);
    _route= inject(ActivatedRoute);
    _loadingService = inject(LoadingService)
    //********* DECLARE CLASSES/ENUMS ***********//
   complaint = new Complaint();
    products: Product[] = [];

    ngOnInit(): void {
        this.getAllProducts();
    }

   
    getAllProducts() {

        this._loadingService.show()
        this._productService.getList( this.currentSize.toString(),
        this.currentPage.toString(),
        this.filterSearch,
        this.filterType.toString(),
        this.filterStatus.toString(),)
        .subscribe({
          next: results => {
              this.displayedList = results;
              this.openFilter = false;
              this._loadingService.hide();
          },
          error: () => {
              this._loadingService.hide();
              this.openFilter = false;
          }
      });
    }

  
  addOne(myForm: NgForm): void {
    if (myForm.valid) {

        console.log(this.complaint);
        
        this._complaintService.createOne(this.complaint).subscribe(() => {
        
          this.onSub();
          this._router.navigate([`../`], { relativeTo: this._route }).then();
        })
    }


  }

  onSub()
  {
  // ask to print a discharge  
  Swal.fire({
    title: 'Discharge Confirmation',
    text: 'Do you want to print the discharge confirmation?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, print it!',
    cancelButtonText: 'No, cancel!'
  }).then((result) => {
    if (result.isConfirmed) {
      //create the pdf
      this.printDischarge();
    } else {
      this.closeDischargeModal();
    }
  })
  }
  // Close the modal and navigate back
  closeDischargeModal() {
    this.showDischargeModal = false;
    this._router.navigate([`../`], { relativeTo: this._route }).then();

  }

  printDischarge() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Discharge Confirmation', 20, 20);
    doc.setFontSize(12);
    doc.text('This document confirms that the client has disposed of the broken product on-site.', 20, 40);

    // Save or print PDF
    doc.save('Discharge.pdf');
  }
  resetForm(myForm: NgForm, event) {
    event.stopPropagation();
    if (myForm.pristine) {
      myForm.resetForm();
    } else {
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
        title: 'Clear',
        message: 'Would you like to clear the information ?',
        actions: {
          confirm: {
            label: 'yes',
          },
          cancel: {
            label: 'no',
          },
        },
      });
      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {
        // If the confirm button pressed...
        if (result === 'confirmed') {
          myForm.resetForm();
        }
      });
    }
  }
  cancelForm(myForm: NgForm) {
    if (myForm.pristine) {
      this._router.navigate([`../`], { relativeTo: this._route }).then();
    } else {
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
        title: 'Cancel',
        message: 'Would you like to cancel the modification ?',
        actions: {
          confirm: {
            label: 'yes',
          },
          cancel: {
            label: 'no',
          },
        },
      });
      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {
        // If the confirm button pressed...
        if (result === 'confirmed') {
          this._router.navigate([`../`], { relativeTo: this._route }).then();
        }
      });
    }
  }
}
