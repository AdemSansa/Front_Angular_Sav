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
import { UserService } from 'app/shared/services/user.service';
import { DatePipe } from '@angular/common';
import { HistoryService } from 'app/shared/services/history.service';
import { History } from 'app/shared/models/history';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
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
        DatePipe,
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
    _userService = inject(UserService)
    history:History = new History()
    _historyService = inject(HistoryService)
    _notificationService= inject (NotificationsService)
    ngOnInit(): void {
        if (this.id) {
            this._loadingService.show()
            forkJoin([
                this._complaintService.getOne(this.id),
            ]).subscribe({
                next: (result:[Complaint ]) => {
                    this.complaint = result[0];
                    console.log(this.complaint);
                    this._userService.getOne(this.complaint.assignedTo).subscribe({
                        next: (result) => {
                            this.complaint.technicianName= result.name;
                        },
                        error: () => {
                            this._loadingService.hide()
                        }
                    })
                    
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
        this.complaint.status = 'In Progress';
        this._complaintService.updateOne(this.complaint).subscribe({
            next: () => {
                this._loadingService.hide()
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'You have started working on the complaint!',
                    confirmButtonText: 'OK',
                });
                this.history.complaintId = this._route.snapshot.paramMap.get('id') || undefined;
                this.history.status = this.complaint.status;
                this.history.description = 'Started working on the complaint';
                this.history.date = new Date();
                
                this._historyService.createOne(this.history).subscribe({
                    next: () => {
                        this._loadingService.hide()
                    },
                    error: () => {
                        this._loadingService.hide()
                    }
                })
                const notification: Notification = {
                    icon: 'search',
                    title: `${this.complaint.technicianName} `,
                    description: `${this.complaint.technicianName} Has started working on the complaint ${this.complaint.name}`,
                    time: new Date().toString(),
                    link: `/home/my-work/${this.complaint._id}`,
                    useRouter: true,
                    read: false,
                    receiver:["admin","Tech_Supervisor"],
                };

                this._notificationService.create(notification).subscribe();



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

                this.history.complaintId = this._route.snapshot.paramMap.get('id') || undefined;
                this.history.status = this.complaint.status;
                this.history.description = 'Paused working on the complaint';
                this.history.date = new Date();
                this._historyService.createOne(this.history).subscribe({
                    next: () => {
                        this._loadingService.hide()
                    },
                    error: () => {
                        this._loadingService.hide()
                    }
                })
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
                this.history.complaintId = this._route.snapshot.paramMap.get('id') || undefined;
                this.history.status = this.complaint.status;
                this.history.description = 'Finished working on the complaint and resolved it';
                this.history.date = new Date();
                this._historyService.createOne(this.history).subscribe({
                    next: () => {
                        this._loadingService.hide()
                    },
                    error: () => {
                        this._loadingService.hide()
                    }
                })

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