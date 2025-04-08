import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { User } from 'app/shared/models/user';
import { CompanyService } from 'app/shared/services/company.service';
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  _userService = inject(UserService);

  _companyService = inject(CompanyService);
  user:User = new User();


  ngOnInit(): void {

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
}