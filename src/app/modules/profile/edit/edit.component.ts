import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { SnackBarComponent } from 'app/shared/components/snack-bar/snack-bar.component';
import { User } from 'app/shared/models/user';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { UserService } from 'app/shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  imports: [ FormsModule,
          MatButton,
          MatFormField,
          MatLabel,
          MatInput,
          
          ReactiveFormsModule,
          TranslocoModule,
         ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {

  user: User = new User();
  snackbarService= inject (SnackBarService);
  router = inject(Router);
  ActivatedRoute = inject(ActivatedRoute);

  constructor(
  
    private userService: UserService
  ) {}

  selectAvatar(avatar: string) {
    this.user.avatar = avatar;
    this.showAvatarPicker = false;
  
    // Optional: Save to backend
    this.saveAvatar(avatar);
  }
  avatarList: string[] = [];
showAvatarPicker = false;
  saveAvatar(avatar: string) {
    // Call your backend API to update user's avatar
    this.userService.selectAvatar( avatar).subscribe({
      next: () => console.log('Avatar updated'),
      error: (err) => console.error(err)
    });
  }

  ngOnInit() {
    this.avatarList = Array.from({ length: 8 }, (_, i) => `assets/images/avatars/avatar${i + 1}.png`);

    this.userService.getUserProfile().subscribe({
      next: (result: any) => {
        this.user = result;
        console.log(this.user);
        
        
      },
      error: (err) => {
        console.error(err);
      }
    }) // Assuming this method returns the user profile

  
    console.log(this.user);
    
  }
  saveProfile() {
    this.userService.updateOne(this.user).subscribe({
      next: (result) => {
        console.log('Profile updated successfully', result);
        this.snackbarService.openSnackBar('Profile updated successfully', 'success');
        Swal.fire({
          title: 'Profile updated successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });

        this.router.navigate(['../'], { relativeTo: this.ActivatedRoute });

      },
      error: (err) => {
        console.error('Error updating profile', err);
        this.snackbarService.openSnackBar('Error updating profile', 'error');
        Swal.fire({
          title: 'Error updating profile',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });

      }
    });
  }

 

}
