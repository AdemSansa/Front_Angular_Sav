import { Route, Router } from "@angular/router";
import { AllRequestsComponent } from "./all-requests/all-requests.component";
import { IssuesComponent } from "./issues/issues.component";
import { DetailsComponent  as IssueDetailsComponent} from "./issues/details/details.component";
import { DetailsComponent as allRequestsDetailsComponent } from "./all-requests/details/details.component";
import { ProfileComponent } from "app/modules/profile/profile.component";
import { MyTechniciansComponent } from "./my-technicians/my-technicians.component";
import { DetailsComponent } from "./my-technicians/details/details.component";

export default [
{
    path: '',
    children: [
        {
            path: 'issues',
           
            children: 
            [
                {
                    path: '',
                    component: IssuesComponent,
                    data: {
                        breadcrumb: 'Issues',
                    }
                
                },
               
                
                    {
                        path: ':id',
                        component: IssueDetailsComponent,
                        data: {
                            breadcrumb: 'Details',
                        }
                    }
            ]
                
           
            
        },
        {
            path: 'all-requests',
           
            children: 
            [
                {
                    path: '',
                    component: AllRequestsComponent,
                    data: {
                        breadcrumb: 'All Requests',
                    }

                },
                {
                    path: ':id',
                    component: allRequestsDetailsComponent,
                    data: {
                        breadcrumb: 'Details',
                    }
                }
            ]

        },
        {
            path:'my-technicians',
            children:[
                {
                    path:'',
                    component: MyTechniciansComponent,
                    data:{
                        breadcrumb:'My Technicians'
                    }
                },
                {
                    path: 'details/:id',
                    component: DetailsComponent,
                    data: {
                        breadcrumb: 'Details',
                    }
                } 
            ]

        }
        ,
        {
            path: '',
            component: ProfileComponent,
        }
       
    ]
}
] as Route[];


