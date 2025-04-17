import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


export default [
   {
    path: '',
    children: [
        {path: '',
            component: ProfileComponent,
            data: {
              breadcrumb: 'profile',
            },},
            {
              path: 'change-password',
              component:ChangePasswordComponent,
              data: {
                breadcrumb: 'change-password',
              },
            },
          

    ]
}

                
             
                
       

   
 ] as Routes;