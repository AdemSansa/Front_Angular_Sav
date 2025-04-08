import { Component, inject } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';
import { ReportService } from 'app/shared/services/report.service';
import _ from 'lodash';
import { Report } from 'app/shared/models/report';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'app/shared/services/user.service';
import { Company } from 'app/shared/models/company';
import { ComplaintService } from 'app/shared/services/complaint.service';
import { Complaint } from 'app/shared/models/complaint';

@Component({
  selector: 'app-report',
  imports: [MatLabel,MatFormFieldModule,FormsModule,
    FormsModule,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,

   
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent {
  report = new Report()

  _complaintService= inject(ComplaintService);

  complaint:Complaint = new Complaint();
  _router = inject(Router);
  _activatedRoute = inject(ActivatedRoute);
  _reportService= inject(ReportService);
  _userService = inject(UserService);

addOne(myForm: NgForm): void {
    if (myForm.valid) {

      this._userService.getUserProfile().subscribe((user) => {
        this.report.userId = user._id;
      }
      );
      this.report.complaintId = this._activatedRoute.snapshot.paramMap.get('id') || undefined;        
      console.log(this.report);
      
        this._reportService.createOne(this.report).subscribe((res) => {

         this.report = res;
         
          Swal.fire({
            icon: 'success',
            title: 'تمت الإضافة بنجاح',
            showConfirmButton: false,
            timer: 1500
          });
          this._complaintService.getOne(this.report.complaintId).subscribe((complaint) => {
            this.complaint = complaint;
            this.complaint.status =  'Under Review';
            this._complaintService.updateOne(this.complaint).subscribe((res) => {
              console.log(res);
            })
          });
            
          this._router.navigate([`../`], { relativeTo: this._activatedRoute }).then();
        })
    }
 

    

}

  
}
