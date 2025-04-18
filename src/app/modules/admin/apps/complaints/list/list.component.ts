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
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import {TranslocoPipe} from "@ngneat/transloco";
import {LoadingService} from "../../../../../shared/services/loading.service";
import { ComplaintService } from 'app/shared/services/complaint.service';
import { Complaint } from 'app/shared/models/complaint';
import { UserService } from 'app/shared/services/user.service';
import { FeatureCodes } from 'app/shared/enums/feature-codes';
import { FeatureActions } from 'app/shared/enums/feature-actions';
import { FeaturesDirective } from 'app/shared/directives/features.directive';
import { listComplaintsStatus } from 'app/shared/enums/complaintsStatus';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [
        MatFormField,
        MatIcon,
        MatPrefix,
        MatInput,
        FormsModule,
        MatButton,
        MatIconButton,
        MatMenuTrigger,
        MatMenu,
        MatMenuItem,
        MatPaginator,
        TranslocoPipe,
        FeaturesDirective,
        MatLabel,
        MatSelectModule,
        MatOptionModule,
        

    ],
})
export class ListComponent implements OnInit {

//********* INJECT SERVICES ***********//
  featureCodes = FeatureCodes;
  featureActions = FeatureActions;
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
  protected readonly listComplaintsStatus = listComplaintsStatus;
  //************* FILTERS *****************//
  openFilter = false;
  filterType: string[] = [];
  filterStatus: string[] = [];
  filterSearch: string;


  _userService = inject(UserService)
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
    console.log( this.filterStatus);

    
    this._complaintService
      .getList(
        this.currentSize.toString(),
        this.currentPage.toString(),
        this.filterSearch,
        this.filterType.toString(),
        this.filterStatus.toString(),
      )
      .subscribe({
          next: results => {
              this.displayedList = results;
              this.openFilter = false;
              this._loadingService.hide();
          },
          error: () => {
              this._loadingService.hide();
              this.openFilter = false;
          }
      });
  }
  addOne(): void {
    this._router.navigate(['add'], { relativeTo: this._route }).then();
  }
  openShow(row: Complaint) {
    this._router.navigate([`${row._id}`], { relativeTo: this._route }).then();
  }
  openEdit(row: Complaint) {
    this._router.navigate([`${row._id}/edit`], { relativeTo: this._route }).then();
  }
  updateSearch() {
    clearTimeout(this.typingTimer);
    this.filterOptions.search = this.filterSearch;
    this.typingTimer = setTimeout(() => {
      this.paginator?.firstPage();
      this.getList();
    }, this.doneTypingInterval);
  }
  deleteOne(row: Complaint) {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete',
      message: 'Would you like to confirm the deletion ?',
      actions: {
        confirm: {
          label: 'yes',
        },
        cancel: {
          label: 'no',
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        this._complaintService.deleteOne(row._id).subscribe(() => {
          this.getList();
        });
      }
    });
  }
  refresh(): void {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.getList();
    }, this.doneTypingInterval);
  }
  openPdf(code:string) {
    this._complaintService.getDischargePdf(code).subscribe({
      next: (pdfBlob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `discharge_${code}.pdf`;
        a.click();
      },
      error: (error) => {
        console.error('Error downloading PDF:', error);
      },
    });
  }


}
