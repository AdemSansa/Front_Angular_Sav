import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatOption, MatSelect } from '@angular/material/select';
import { User } from 'app/shared/models/user';
import { UserService } from 'app/shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatChipGrid, MatChipsModule } from '@angular/material/chips';
import { MatChipListbox } from '@angular/material/chips';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-my-technicians',
  imports: [FormsModule,NgClass ,MatIcon,DatePipe,MatChipsModule ,MatButton],
  templateUrl: './my-technicians.component.html',
  styleUrl: './my-technicians.component.scss'
})
export class MyTechniciansComponent  implements OnInit{



  _router = inject(Router)
  _activatedRoute = inject(ActivatedRoute)
  _UserService = inject(UserService);

  technicians: User [] = [];
  ngOnInit(): void {
    this._UserService.getTechs().subscribe({
      next: (result) => {
        this.technicians = result;
      },
      error: (err) => {
        console.error(err);
      }
    })
    
  }
  viewTechnicianDetails(id: string) {
    this._router.navigate(['details', id], { relativeTo: this._activatedRoute });
  }
}
