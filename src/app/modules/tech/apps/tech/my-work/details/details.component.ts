import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import {TranslocoPipe} from "@ngneat/transloco";
import { LoadingService } from 'app/shared/services/loading.service';
import {forkJoin} from "rxjs";
import { ComplaintService } from 'app/shared/services/complaint.service';
import { Complaint } from 'app/shared/models/complaint';
import Swal from 'sweetalert2';

 @Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatFormField,
        MatLabel,
        MatInput,
        ReactiveFormsModule,
        TranslocoPipe,
        RouterLink
    ],
})
export class DetailsComponent implements OnInit {
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
                next: (result:[Complaint ]) => {
                    this.complaint = result[0];
                    this._loadingService.hide()
                },
                error: () => {
                    this._loadingService.hide()
                }
            });
        }
    }

    StartWorking() {
        this._loadingService.show()
        this._complaintService.startWorking(this.id).subscribe({
            next: () => {
                this._loadingService.hide()
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'You have started working on the complaint!',
                    confirmButtonText: 'OK',
                });
                //refresh 


                this._router.navigate(['/home/my-work']);
            },
            error: () => {
                this._loadingService.hide()
            }
        });
    }
    PauseWorking() {
        this._loadingService.show()
        this.complaint.status = 'Paused';
        this._complaintService.updateOne(this.complaint).subscribe({
            next: () => {
                this._loadingService.hide()
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'You have paused working on the complaint!',
                    confirmButtonText: 'OK',
                });
                //refresh 

                this._router.navigate(['/home/my-work']);
            },
            error: () => {
                this._loadingService.hide()
            }
        });
    }
    FinishWorking() {
        this._loadingService.show()
        this.complaint.status = 'Resolved';
        this._complaintService.updateOne(this.complaint).subscribe({
            next: () => {
                this._loadingService.hide()
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'You have finished working on the complaint!',
                    confirmButtonText: 'OK',
                });
                //refresh 

                this._router.navigate(['/home/my-work']);
            },
            error: () => {
                this._loadingService.hide()
            }
        });
    }

   
  
    requestReturn() {
        this._router.navigate([`/home/my-work/${this.complaint._id}/report`]).then();

    
    }

  }