import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';

import { NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import {TranslocoModule} from "@ngneat/transloco";
import {forkJoin} from "rxjs";
import {LoadingService} from "../../../../../../../shared/services/loading.service";
import { ComplaintService } from 'app/shared/services/complaint.service';
import { Complaint } from 'app/shared/models/complaint';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    ReactiveFormsModule,
    TranslocoModule,
  ],
})
export class EditComponent implements OnInit {
    //********* INJECT SERVICES ***********//
    _complaintService= inject(ComplaintService);
    _router= inject(Router);
    _route= inject(ActivatedRoute);
    _fuseConfirmationService= inject(FuseConfirmationService);
    _loadingService= inject(LoadingService);
    //********* DECLARE CLASSES/ENUMS ***********//
    id = this._route.snapshot.paramMap.get('id') || undefined;
    complaint = new Complaint();
    ngOnInit(): void {
        if (this.id) {
            this._loadingService.show()
            forkJoin([
                this._complaintService.getOne(this.id),
            ]).subscribe({
                next: (result:[Complaint]) => {
                    this.complaint = result[0];
                    this._loadingService.hide()
                },
                error: () => {
                    this._loadingService.hide()
                }
            });
        }
      }
    updateOne(myForm: NgForm) {
        if (myForm.valid) {
            this._complaintService.updateOne(this.complaint).subscribe(() => {
               this._router.navigate(['../'], { relativeTo: this._route }).then();
            });
        }
      }
    cancelEdit(myForm: NgForm) {
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
    deleteOne(row: Complaint) {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
          title: 'Delete',
          message: 'Would you like to confirm the deletion ?',
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
            this._complaintService.deleteOne(row._id).subscribe(() => {
                this._router.navigate([`../`], { relativeTo: this._route }).then();
            });
          }
        });
      }
}
