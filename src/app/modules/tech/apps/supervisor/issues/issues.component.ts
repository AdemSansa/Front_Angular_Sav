import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton, MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatPrefix, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslocoPipe } from '@ngneat/transloco';
import { listRequestsAssign } from 'app/shared/enums/requestsAssign';
import { Complaint } from 'app/shared/models/complaint';
import { FilterOptions } from 'app/shared/models/filter-options';
import { Pagination } from 'app/shared/models/pagination';
import { ComplaintService } from 'app/shared/services/complaint.service';
import { HistoryService } from 'app/shared/services/history.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { UserService } from 'app/shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issues',
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
      TranslocoPipe,
    MatLabel,
  MatSelectModule,
  MatButtonModule,
  MatOption],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.scss'
})
export class IssuesComponent {
 //********* INJECT SERVICES ***********//
  _userService = inject(UserService)
  _historyService = inject(HistoryService)
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
    readonly listRequestStatus = listRequestsAssign;
  
    ngOnInit(): void {
      this.getList();
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
      this.getList();
    }
    getList(): void {
      this._loadingService.show();
      this._complaintService
        .getUnderReviwedComplaints(
          this.currentSize.toString(),
          this.currentPage.toString(),
          this.filterSearch,
          this.filterType.toString(),
          this.filterStatus.toString(),
        )
        .subscribe({
            next: results => {
                this.displayedList = results;
                results.data.forEach((item: Complaint) => {
                 if(item.assignedTo) {
                    this._userService.getOne(item.assignedTo).subscribe((user) => {
                      item.assignedTo = user.name;
                    })
                  }
                 
                 
                  
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
        this.getList();
      }, this.doneTypingInterval);
    }
   
    refresh(): void {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.getList();
      }, this.doneTypingInterval);
    }
  }