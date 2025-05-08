import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from 'app/shared/models/user';
import { CompanyService } from 'app/shared/services/company.service';
import { UserService } from 'app/shared/services/user.service';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { UserOpComponent } from 'app/layout/common/user/user.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { ComplaintService } from 'app/shared/services/complaint.service';
import { Complaint } from 'app/shared/models/complaint';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-profile',
  imports: [DatePipe ,RouterLink,FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  _complaintService = inject(ComplaintService);

  _userService = inject(UserService);
  _router = inject(Router);
  _activatedRoute = inject(ActivatedRoute);

  _companyService = inject(CompanyService);
  user:User = new User();
  complaints: Complaint[] = [];
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;

  selectedComplaintType: 'total' | 'resolved' | 'pending' | null = null;

  ngOnInit(): void {
    
    this.avatarList = Array.from({ length: 8 }, (_, i) => `assets/images/avatars/avatar${i + 1}.png`);
    this.getUserComplaints();

    this._userService.getUserProfile().subscribe({
      next: (result: User) => {
        this.user = result;
        console.log(this.user);
        this.getcompany();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
 getcompany(){
    this._companyService.getOne(String(this.user.companyId)).subscribe({
      next: (result) => {
        this.user.companyName = result.name;
      },
      error: (err) => {
        console.error(err);
      }
    })

  

}

goToChangePassword() {
  this._router.navigate(['change-password'], { relativeTo: this._activatedRoute });
}
avatarList: string[] = [];
showAvatarPicker = false;


selectAvatar(avatar: string) {
  this.user.avatar = avatar;
  this.showAvatarPicker = false;

  // Optional: Save to backend
  this.saveAvatar(avatar);
}

saveAvatar(avatar: string) {
  // Call your backend API to update user's avatar
  this._userService.selectAvatar( avatar).subscribe({
    next: () => console.log('Avatar updated'),
    error: (err) => console.error(err)
  });
}
goToEditProfile() {
  this._router.navigate(['edit'], { relativeTo: this._activatedRoute });
}
getUserComplaints() {
  this._complaintService.getComplaintsByUser(
    this.user.id,
    '',
    '',
    '',
    '',
    ""
  ).subscribe({
    next: (result) => {
      this.complaints = result.data;
      this.totalComplaints = result.total;
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

