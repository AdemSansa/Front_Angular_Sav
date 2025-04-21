import { Component, inject, OnInit, ViewChild } from '@angular/core';
import 'mapbox-gl/dist/mapbox-gl.css'; // ✅ important!

import mapboxgl from 'mapbox-gl';
import { SiteService } from 'app/shared/services/site.service';
import { Site } from 'app/shared/models/site';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FilterOptions } from 'app/shared/models/filter-options';
import { Pagination } from 'app/shared/models/pagination';
import { LoadingService } from 'app/shared/services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  _siteService = inject(SiteService)
      map!: mapboxgl.Map;
    marker!: mapboxgl.Marker;
    
    mapboxToken: string = 'pk.eyJ1IjoieW9zcmEtbmFqYXIiLCJhIjoiY2xmdGw2a20wMDF4eTNxcDBiMHZycnZpdCJ9.PTo1tyEyJry6uEKaqRLkRQ'; // 👈 Put your real Mapbox token here
    lat: number = 36.8065;
    lng: number = 10.1815;
    sites :Site[] = [];

     _router= inject(Router);
      _fuseConfirmationService= inject(FuseConfirmationService);
      _route= inject(ActivatedRoute);
      _loadingService = inject(LoadingService)
      @ViewChild(MatPaginator) paginator: MatPaginator;
      filterOptions: FilterOptions = new FilterOptions();
      currentSize = 10;
      currentPage = 1;
      displayedList: Pagination<Site>;
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
     this.initMap();
 }

 getList(): void {
  this._loadingService.show();
  this._siteService
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

  initMap(): void {
    mapboxgl.accessToken = this.mapboxToken;
  
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.lng, this.lat],
      zoom: 8,
    });
  
    this.map.addControl(new mapboxgl.NavigationControl());
  
    this.map.on('load', () => {
      console.log('Map loaded at:', this.lat, this.lng);
      for (let i = 0; i < this.displayedList.data.length; i++) {
        const site = this.displayedList.data[i];
        console.log('site:', site);
        this.sites.push(site);
        this.lat = site.latitude;
        this.lng = site.longitude;
        console.log('lat:', this.lat, 'lng:', this.lng);
  
        // Create a marker for each site
        const marker = new mapboxgl.Marker()
          .setLngLat([this.lng, this.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<h4>${site.name}</h4>`))
          .addTo(this.map);
  
        console.log('Marker created:', marker);
      }
  
      this.marker = new mapboxgl.Marker()
        .setLngLat([this.lng, this.lat])
        //show its name 
        .setPopup(new mapboxgl.Popup().setHTML(`<h4>baw</h4>`))
    
        .addTo(this.map);
  
      console.log('Marker created:', this.marker);
  
      this.marker.on('dragend', () => {
        const lngLat = this.marker.getLngLat();
        this.lat = lngLat.lat;
        this.lng = lngLat.lng;
        console.log('New coords:', this.lat, this.lng);
      });
  
      
    });
  }
  
  

}
