import { Component, inject, ViewChild } from '@angular/core';
import { ComplaintService } from 'app/shared/services/complaint.service';
import { UserService } from 'app/shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { LoadingService } from 'app/shared/services/loading.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FilterOptions } from 'app/shared/models/filter-options';
import { Pagination } from 'app/shared/models/pagination';
import { Complaint } from 'app/shared/models/complaint';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  selector: 'app-my-work',
  imports: [MatFormField,
      MatIcon,
      MatPrefix,
      MatInput,
      FormsModule,
      
      MatIconButton,
      MatMenuTrigger,
      MatMenu,
      MatMenuItem,
      MatPaginator,
      TranslocoPipe,],
  templateUrl: './my-work.component.html',
  styleUrl: './my-work.component.scss'
})
export class MyWorkComponent {
 
  //********* INJECT SERVICES ***********//
  _userService = inject(UserService)
    _complaintService= inject(ComplaintService);
    _router= inject(Router);
    _fuseConfirmationService= inject(FuseConfirmationService);
    _route= inject(ActivatedRoute);
    _loadingService = inject(LoadingService)
    @ViewChild(MatPaginator) paginator: MatPaginator;
    filterOptions: FilterOptions = new FilterOptions();
    currentSize = 10;
    currentPage = 1;
    displayedList: Pagination<Complaint>;
    typingTimer;
    doneTypingInterval = 500;
    isScreenSmall: boolean;
    //************* FILTERS *****************//
    openFilter = false;
    filterType: string[] = [];
    filterStatus: string[] = [];
    filterSearch: string;
  userId: string 

    ngOnInit(): void {
      this._userService.getUserProfile().subscribe((user) => {
        this.userId = user._id;
        this.getList(this.userId);
      }
      );
      
    }
    pageChanged(event: PageEvent ): void {
      let { pageIndex } = event;
      const { pageSize } = event;
      pageIndex++;
      if (pageSize !== this.currentSize) {
        pageIndex = 1;
        this.paginator.firstPage();
      }
      this.currentSize = pageSize;
      this.currentPage = pageIndex;
      this.getList(this.userId);
    }
    getList(id:string): void {
      this._loadingService.show();
      this._complaintService.getMywork(
        id
        )
        .subscribe({
            next: results => {
                this.displayedList = results;
                console.log(this.displayedList);
                
                results.data.forEach((item: Complaint) => {
                  this._userService.getOne(item.assignedTo).subscribe((user) => {
                    item.assignedTo = user.name;
                  })
                })
                
                this.openFilter = false;
                this._loadingService.hide();
            },
            error: () => {
                this._loadingService.hide();
                this.openFilter = false;
            }
        });
    }
   
    openShow(row: Complaint) {
      this._router.navigate([`${row._id}`], { relativeTo: this._route }).then();
    }

    updateSearch() {
      clearTimeout(this.typingTimer);
      this.filterOptions.search = this.filterSearch;
      this.typingTimer = setTimeout(() => {
        this.paginator?.firstPage();
        this.getList( this.userId);
      }, this.doneTypingInterval);
    }
   
    refresh(): void {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.getList( this.userId);
      }, this.doneTypingInterval);
    }
  }
  

