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
import { jsPDF } from 'jspdf';

// Cast `pdfMake` as any to avoid assignment issues
import { MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import { SnackBarService } from 'app/shared/services/snack-bar.service';


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

  _productService = inject(ProductService);
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

    _snackBarService= inject(SnackBarService);
 
  
    //********* INJECT SERVICES ***********//
   _complaintService= inject(ComplaintService);
    _router= inject(Router);
    _fuseConfirmationService= inject(FuseConfirmationService);
    _route= inject(ActivatedRoute);
    _loadingService = inject(LoadingService)
    //********* DECLARE CLASSES/ENUMS ***********//
   complaint = new Complaint();
    products: Product[] = [];
    dischargePdfUrl: string;

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
        
        this._complaintService.createOne(this.complaint).subscribe({
          next: (result) => {
            if (result) {
            this.complaint = result;
            const code = this.complaint.code;
            this._complaintService.getDischargePdf(code).subscribe({
          next: (pdfBlob) => {
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `discharge_${code}.pdf`;
            a.click();
          },
          error: (error) => {
            console.error('Error downloading PDF:', error);
          },
        });

      
      // Example: Open it in a new tab or offer to print

      // Or store it in a variable to show a "Download PDF" button
            this._router.navigate([`../`], { relativeTo: this._route }).then();
            }
          },
          error: () => {
            this._loadingService.hide();
            this._snackBarService.openSnackBar("Cannot Create Complaint");
          },
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
    
      const complaintDate = new Date().toLocaleDateString(); // More readable format

      const trackingLink = `https://tracking-link.com/${this.complaint.code}`; // Replace with actual tracking link
      const doc = new jsPDF();
      
      // Set font styles
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Discharge Receipt', 105, 20, { align: 'center' });
      
      // Add a line below the title
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);
      
      // Add some space
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      // Border box for main details
      doc.roundedRect(15, 35, 180, 40, 3, 3);
      doc.text(`Complaint Code: ${this.complaint.code}`, 20, 40);
      doc.text(`Client Name: ${this.complaint.name}`, 20, 50);
      doc.text(`Date: ${complaintDate}`, 20, 60);
      doc.text(`Check Status: ${trackingLink}`, 20, 70);
      
      // Table of disposed products
      const headers = [['Product', 'Quantity']];
      console.log(this.complaint.product);
      
      this._productService.getOne(this.complaint.product).subscribe((product) => {
        this.products.push(product);
      }
    )

      const rows = this.products.map((product) => [product.name]);

    
      
      // Draw table
      (autoTable as any)(doc, {
        startY: 80,
        head: headers,
        body: rows,
        theme: 'striped',
        styles: { fontSize: 10 },
        
        headStyles: { fillColor: [44, 62, 80] },
      });
      
      // Save the document
      doc.save(`Discharge_${this.complaint.code}.pdf`);
    
  
 
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
