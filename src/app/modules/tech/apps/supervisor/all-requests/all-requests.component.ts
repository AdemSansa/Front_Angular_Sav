import {Component, inject, OnInit, ViewChild} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { FilterOptions } from '../../../../../shared/models/filter-options';
import { Pagination } from '../../../../../shared/models/pagination';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInput} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import {TranslocoPipe} from "@ngneat/transloco";
import {LoadingService} from "../../../../../shared/services/loading.service";
import { ComplaintService } from 'app/shared/services/complaint.service';
import { Complaint } from 'app/shared/models/complaint';
import { UserService } from 'app/shared/services/user.service';
import { HistoryService } from 'app/shared/services/history.service';
@Component({
  selector: 'app-all-requests',
  imports: [  MatFormField,
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
  templateUrl: './all-requests.component.html',
  styleUrl: './all-requests.component.scss'
})
export class AllRequestsComponent {

  
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
        .getSubmittedComplaints(
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
  

