import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditComponent } from './edit/edit.component';


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
            {
              path:'edit',
              component:EditComponent,
              data: {
                breadcrumb: 'edit',
              },
          
            }
          

    ]
}

                
             
                
       

   
 ] as Routes;