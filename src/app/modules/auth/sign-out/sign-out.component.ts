import { I18nPluralPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';
import {AuthService} from "../../../shared/services/auth.service";
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'auth-sign-out',
    templateUrl: './sign-out.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [RouterLink, I18nPluralPipe]
})
export class AuthSignOutComponent implements OnInit, OnDestroy
{


    countdown: number = 5;
    countdownMapping: any = {
        '=1'   : '# second',
        'other': '# seconds',
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
    )
    {
    }

    _userService = inject(UserService)
    user:User
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
         // Redirect after the countdown
         timer(1000, 1000)
         .pipe(
             finalize(() =>
             {
                 
                 this._router.navigate(['sign-in']);
             }),
             takeWhile(() => this.countdown > 0),
             takeUntil(this._unsubscribeAll),
             tap(() => this.countdown--),
         )
         .subscribe();
          // Sign out
       
        // Remove the access token from the local storage
               this._userService.user$.subscribe((user: User) => {
                  if (user) {
                      console.log(user);
                      
                      user.status = 'not-visible';
                      this._userService.update(user).subscribe({
                          next: (user) => {
                              console.log('User status updated successfully');
                              console.log(user);
                              
      
                          },
                          error: (error) => {
                              console.error('Error updating user status:', error);
                          },
                      });
      
                  }
              });

       
       


       
        
       
        this._authService.signOut();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
