import {Component, inject, OnInit, ViewChild} from '@angular/core';
import { NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import {TranslocoPipe} from "@ngneat/transloco";
import {LoadingService} from "../../../../../shared/services/loading.service";
import { SiteService } from 'app/shared/services/site.service';
import { Site } from 'app/shared/models/site';
import { MatOptionModule } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

import L from 'leaflet';
import { CompanyService } from 'app/shared/services/company.service';
import { FilterOptions } from 'app/shared/models/filter-options';
import { MatPaginator } from '@angular/material/paginator';
import { Pagination } from 'app/shared/models/pagination';
import { Company } from 'app/shared/models/company';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-details',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations,
    imports: [
        FormsModule,
        MatButton,
        MatFormField,
        MatLabel,
        MatInput,
        MatError,
        ReactiveFormsModule,
        TranslocoPipe,
        MatOptionModule,
        MatSelect,
        MatSelectModule,

        MatFormField,
        MatLabel,

    ],
})
export class AddComponent implements OnInit {
    //********* INJECT SERVICES ***********//
    _siteService = inject(SiteService)
    _router= inject(Router);
    _fuseConfirmationService= inject(FuseConfirmationService);
    _route= inject(ActivatedRoute);
    _loadingService = inject(LoadingService)
    _companyService = inject(CompanyService)
    //********* DECLARE CLASSES/ENUMS ***********//
      @ViewChild(MatPaginator) paginator: MatPaginator;
      filterOptions: FilterOptions = new FilterOptions();
      currentSize = 10;
      currentPage = 1;
      typingTimer;
      doneTypingInterval = 500;
      isScreenSmall: boolean;
      //************* FILTERS *****************//
      openFilter = false;
      filterType: string[] = [];
      filterStatus: string[] = [];
      filterSearch: string;
      displayedList: Pagination<Company>;
    

    ngOnInit(): void {
        this.initMap();
        this.getCompanies();
    }

    lat: number = 36.8065; // Default latitude (e.g., Tunis)
  lng: number = 10.1815; // Default longitude
  map: any;
  marker: any;
    site = new Site();


    getCompanies() {
        this._companyService.getList( 
          this.currentSize.toString(),
          this.currentPage.toString(),
          this.filterSearch,
          this.filterType.toString(),
          this.filterStatus.toString(),
        ).subscribe({

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
  addOne(myForm: NgForm): void {
    if (myForm.valid) {
        this.site.latitude = this.lat;
        this.site.longitude = this.lng;

      
        this._siteService.createOne(this.site).subscribe(() => {
            this._router.navigate([`../`], { relativeTo: this._route }).then();
        })
    }
  }
  resetForm(myForm: NgForm, event) {
    event.stopPropagation();
    if (myForm.pristine) {
      myForm.resetForm();
    } else {
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
        title: 'Clear',
        message: 'Would you like to clear the information ?',
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
          myForm.resetForm();
        }
      });
    }
  }
  cancelForm(myForm: NgForm) {
    if (myForm.pristine) {
      this._router.navigate([`../`], { relativeTo: this._route }).then();
    } else {
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
        title: 'Cancel',
        message: 'Would you like to cancel the modification ?',
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
          this._router.navigate([`../`], { relativeTo: this._route }).then();
        }
      });
    }
  }
  initMap(): void {
    this.map = L.map('map').setView([this.lat, this.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([this.lat, this.lng], { draggable: true }).addTo(this.map);

    this.marker.on('dragend', (e: any) => {
      const position = e.target.getLatLng();
      this.lat = position.lat;
      this.lng = position.lng;
    });

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.lat = lat;
      this.lng = lng;
      this.marker.setLatLng([lat, lng]);
    });
  }

}
