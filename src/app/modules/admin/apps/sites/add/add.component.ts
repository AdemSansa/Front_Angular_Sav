import {Component, inject, input, OnInit, ViewChild} from '@angular/core';
import { NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import {getValue, TranslocoPipe} from "@ngneat/transloco";
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
import 'mapbox-gl/dist/mapbox-gl.css'; // ✅ important!
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import mapboxgl from 'mapbox-gl';
import { size, values } from 'lodash';
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
      map!: mapboxgl.Map;
      marker!: mapboxgl.Marker;
      
      mapboxToken: string = 'pk.eyJ1IjoieW9zcmEtbmFqYXIiLCJhIjoiY2xmdGw2a20wMDF4eTNxcDBiMHZycnZpdCJ9.PTo1tyEyJry6uEKaqRLkRQ'; // 👈 Put your real Mapbox token here
      lat: number = 36.8065;
      lng: number = 10.1815;
    

    ngOnInit(): void {
        this.initMap();
        this.getCompanies();
    }


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
    mapboxgl.accessToken = this.mapboxToken;
  
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.lng, this.lat],
      zoom: 13,
    });
  
    this.map.addControl(new mapboxgl.NavigationControl());
  
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
  
      placeholder: 'Search for address in Tunisia',
      zoom: 15,
  
    
      countries: 'TN',
      //get the input from the input field



      marker: false // we'll use our custom marker
    });
  
this.map.addControl(geocoder, 'top-left');
  
    // when a result is selected from the geocoder
    geocoder.on('result', (event) => {
      const coords = event.result.geometry.coordinates;
      this.lng = coords[0];
      this.lat = coords[1];
      this.map.flyTo({ center: coords, zoom: 15 });
      this.marker.setLngLat(coords);
      this.site.address = event.result.place_name;

    });
  
    this.map.on('load', () => {
      this.marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat([this.lng, this.lat])
        .addTo(this.map);
  
      this.marker.on('dragend', () => {
        const lngLat = this.marker.getLngLat();
        this.lat = lngLat.lat;
        this.lng = lngLat.lng;
      });
  
      this.map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        this.lat = lat;
        this.lng = lng;
        this.marker.setLngLat([lng, lat]);
      });
    });
  }
}
