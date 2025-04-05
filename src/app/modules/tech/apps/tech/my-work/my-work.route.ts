import { Route } from "@angular/router";
import { MyWorkComponent } from "./my-work.component";
import { DetailsComponent } from "./details/details.component";
import { ReportComponent } from "./report/report.component";

export default [
  {
    path: '',
    children: [
          {
                path: '',
                component: MyWorkComponent,
                data: {
                  breadcrumb: 'My Work',
                },
              },
             {
                path: ':id',
                children: [
                {
                    path: '',
                    component: DetailsComponent,
                },
                {
                    path: 'report',
                    component:ReportComponent,
                },
                            ],
                             },
        
           


    ]
  },
] as Route[];
