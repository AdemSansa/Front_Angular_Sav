import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatError} from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import {TranslocoPipe} from "@ngneat/transloco";
import { LoadingService } from 'app/shared/services/loading.service';
import {forkJoin} from "rxjs";
import { ComplaintService } from 'app/shared/services/complaint.service';
import { Complaint } from 'app/shared/models/complaint';
import Swal from 'sweetalert2';
import { AssignTechnicianDialogComponent } from 'app/shared/components/assign-technician-dialog/assign-technician-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'app/shared/services/user.service';
import { HistoryService } from 'app/shared/services/history.service';
import { History } from 'app/shared/models/history';
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
    ],
})
export class DetailsComponent implements OnInit {
    //********* INJECT SERVICES ***********//
    _complaintService= inject(ComplaintService);
    _router= inject(Router);
      _historyService = inject(HistoryService)
      history = new History()
    
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
   
    dialog=inject(MatDialog);
    userService = inject(UserService)
    openAssignDialog() {
        this.userService.getTechs().subscribe((techs) => {
            const technicians=techs
      



      
        const dialogRef = this.dialog.open(AssignTechnicianDialogComponent, {
          width: '400px',
          data: { technicians }
        });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('Technician assigned:', result);
            // Call API to assign the technician
            this.assignTechnicianToComplaint(result);
          }
        });
    }
)
      }
      
      assignTechnicianToComplaint(technicianId: string) {
       
        this._loadingService.show()
        this._complaintService.assignTechnician(this.complaint._id, technicianId).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Technician Assigned',
                    text: 'The technician has been assigned successfully.',
                    confirmButtonText: 'OK',
                });
                this._loadingService.hide()
             
            },
            error: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to assign the technician.',
                    confirmButtonText: 'OK',
                });
                this._loadingService.hide()
            }
        })
      }


  }