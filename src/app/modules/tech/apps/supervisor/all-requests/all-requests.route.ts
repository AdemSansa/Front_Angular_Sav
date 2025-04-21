import { Route, Router } from "@angular/router";
import { AllRequestsComponent } from "./all-requests.component";
import { DetailsComponent } from "./details/details.component";
import { MyWorkComponent } from "../../tech/my-work/my-work.component";

export default [
  {
    path: '',
    children: [
          {
                path: '',
                component: AllRequestsComponent,
                data: {
                  breadcrumb: 'Requests',
                },
              },
         {
               path: ':id',
               children: [
                 {

                   path: '',
                   component: DetailsComponent,
                    data: {
                      breadcrumb: 'Details',
                    },
                    
                 },
               ],
                },
           


    ]
  },
] as Route[];
