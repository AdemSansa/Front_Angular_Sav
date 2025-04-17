import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { UserService } from 'app/shared/services/user.service';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  MatLabel],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent  {
  passwordForm: FormGroup;
  _userService = inject(UserService)
  _snackbar = inject(SnackBarService)

router = inject(Router)
activatedRoute = inject(ActivatedRoute)
;
currentPassError: string | null = null;
  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatch });
  }

  
  passwordsMatch(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const values = this.passwordForm.value;
      //get User iD

      const token = this._userService.getToken()
    const decodedToken = jwtDecode<JwtPayload>(token);
  
      const id =decodedToken['id']
      this._userService.changePassword(values.currentPassword, values.newPassword,id).subscribe({
        next: (result) => {

          this._snackbar.openSnackBar('Password changed successfully', 'success')
          
          //go back to profile
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
          // Handle success response
        },
        error: (error) => {


          this.currentPassError = error.error.message;
          console.error(error);
          this._snackbar.openSnackBar(this.currentPassError, 'error')
          // Handle error response
        }
      });
      console.log('Form submitted:', values);
   
    }
  }
}
