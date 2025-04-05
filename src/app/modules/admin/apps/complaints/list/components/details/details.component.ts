import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatError} from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import {TranslocoPipe} from "@ngneat/transloco";
import {LoadingService} from "../../../../../../../shared/services/loading.service";
import {forkJoin} from "rxjs";
import { ComplaintService } from 'app/shared/services/complaint.service';
import { Complaint } from 'app/shared/models/complaint';
import { ReportService } from 'app/shared/services/report.service';
import { Report } from 'app/shared/models/report';
import { DatePipe } from '@angular/common';
import { UserService } from 'app/shared/services/user.service';
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
        DatePipe
    ],
})
export class DetailsComponent implements OnInit {
    //********* INJECT SERVICES ***********//
    _complaintService= inject(ComplaintService);
    _reportService= inject(ReportService);
    _router= inject(Router);
    _route= inject(ActivatedRoute);
    _fuseConfirmationService= inject(FuseConfirmationService);
    _loadingService= inject(LoadingService);
    report:Report[] = [];
    _userService= inject(UserService);    
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
        this.getReport();
    }
    updateOne() {
        this._router.navigate([`/home/companies/${this.complaint._id}/edit`]).then();
    }
    deleteOne() {
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
                this._complaintService.deleteOne(this.complaint._id).subscribe(() => {});
                this._router.navigate(['/home/complaints']).then();
            }
        });
    }


    getReport() {
    this._reportService.getByComplaintId(this.id ).subscribe({
      next: (result) => {
        
        this.report = result;
        this.report.forEach((report) => {
            report.createdAt = new Date(report.createdAt!);
            report.updatedAt = new Date(report.updatedAt!);
            this._userService.getOne(report.userId!).subscribe({
                next: (user) => {
                    report.userId = user.name;
                },
                error: (err) => {
                    console.log(err);
                },
            });
            }   );
        
        console.log(this.report);
        
      },
        error: (err) => {
            console.log(err);
        },
    });


    
    }


  }