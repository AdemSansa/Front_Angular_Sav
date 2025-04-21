import { Route } from '@angular/router';
import { DetailsComponent } from './list/components/details/details.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './list/components/edit/edit.component';
import {ListComponent} from "./list/list.component";
import { MapComponent } from './map/map.component';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListComponent,
        data: {
          breadcrumb: 'Sites',
        },
      },
      {
        path: 'add',
        component: AddComponent,
        data: {
          breadcrumb: 'Add',
        },
      },
      {
        path:'map',
        component: MapComponent,
        data: {
          breadcrumb: 'Map',
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
          {
            path: 'edit',
            component: EditComponent,
            data: {
              breadcrumb: 'Edit',
            },
          },
        ],
      },
    ],
  },
] as Route[];
