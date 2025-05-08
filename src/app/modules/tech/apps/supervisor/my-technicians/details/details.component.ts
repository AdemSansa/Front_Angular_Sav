import { DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Complaint } from 'app/shared/models/complaint';
import { ComplaintService } from 'app/shared/services/complaint.service';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-details',
  imports: [NgClass ,MatIcon,DatePipe ,FormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {

  _userService = inject(UserService);

  _complaintService = inject(ComplaintService);
  complaints: Complaint[] = [];
  totalcomplaints: number;
  resolvedComplaints: number = 0;
  pendingComplaints: number = 0;
  selectedComplaintType: 'total' | 'resolved' | 'pending' | null = null;

  _route = inject(ActivatedRoute);
  tech: any;
  technicianId = this._route.snapshot.paramMap.get('id');

ngOnInit() {
  if (this.technicianId) {
    this._userService.getOne(this.technicianId).subscribe({
      next: (res) => this.tech = res,
      error: (err) => console.error(err)
    });
    this.getUserComplaints();

    // TODO: fetch complaint stats too
  }

}


getUserComplaints() {
  this._complaintService.getComplaintsByUser(
    this.technicianId ,
    '',
    '',
    '',
    '',
    ""
  ).subscribe({
    next: (result) => {
      this.complaints = result.data;
      this.totalcomplaints = result.total;
      console.log(this.complaints);
      
      this.resolvedComplaints = this.complaints.filter(c => c.status === 'Resolved').length;
      this.pendingComplaints = this.complaints.filter(c => c.status === 'Paused' ).length;
      this.pendingComplaints += this.complaints.filter(c => c.status==="Handeled By Tech" ).length;
      this.pendingComplaints += this.complaints.filter(c => c.status==="In Progress" ).length;

  
      
    },
    error: (err) => {
      console.error(err);
    }
  });
}
searchTerm: string = '';

get filteredComplaints(): any[] {
  let list = [];
  if (this.selectedComplaintType === 'resolved') {
    list = this.complaints.filter(c => c.status === 'Resolved');
  } else if (this.selectedComplaintType === 'pending') {
    list = this.complaints.filter(c => c.status === 'Paused' || c.status === 'In Progress' || c.status === 'Handeled By Tech');
  } else if (this.selectedComplaintType === 'total') {
    list = this.complaints;
  }

  if (!this.searchTerm.trim()) {
    return list;
  }

  const term = this.searchTerm.toLowerCase();
  return list.filter(c =>
    (c.code?.toLowerCase().includes(term) ?? false) ||
    (c.title?.toLowerCase().includes(term) ?? false)
  );
}






}
