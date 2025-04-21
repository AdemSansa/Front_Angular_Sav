import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatError} from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import {TranslocoPipe} from "@ngneat/transloco";
import {LoadingService} from "../../../../../../../shared/services/loading.service";
import {forkJoin} from "rxjs";
import { SiteService } from 'app/shared/services/site.service';
import { Site } from 'app/shared/models/site';
import { CompanyService } from 'app/shared/services/company.service';
import L from 'leaflet';
import 'mapbox-gl/dist/mapbox-gl.css'; // ✅ important!

import mapboxgl from 'mapbox-gl';

 @Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatFormField,
        MatLabel,
        MatInput,
        ReactiveFormsModule,
        MatError,
        TranslocoPipe,
    ],
})
export class DetailsComponent implements OnInit {
    map!: mapboxgl.Map;
  marker!: mapboxgl.Marker;
  
  mapboxToken: string = 'pk.eyJ1IjoieW9zcmEtbmFqYXIiLCJhIjoiY2xmdGw2a20wMDF4eTNxcDBiMHZycnZpdCJ9.PTo1tyEyJry6uEKaqRLkRQ'; // 👈 Put your real Mapbox token here
  lat: number = 36.8065;
  lng: number = 10.1815;

    
    //********* INJECT SERVICES ***********//
    _siteService = inject(SiteService)
    _router= inject(Router);
    _route= inject(ActivatedRoute);
    _fuseConfirmationService= inject(FuseConfirmationService);
    _loadingService= inject(LoadingService);
    _companyService = inject(CompanyService)
    //********* DECLARE CLASSES/ENUMS ***********//
    id = this._route.snapshot.paramMap.get('id') || undefined;
    site = new Site();

    ngOnInit(): void {
        if (this.id) {
            this._loadingService.show();
            forkJoin([
                this._siteService.getOne(this.id),
            ]).subscribe({
                next: (result: [Site]) => {
                    this.site = result[0];
                    this.lat = this.site.latitude || 36.8065;
                    this.lng = this.site.longitude || 10.1815;
    
                    this._companyService.getOne(this.site.companyId).subscribe({
                        next: (company) => {
                            this.site.companyName = company.name;
                        },
                        error: () => {
                            this._loadingService.hide();
                        }
                    });
    
                    this._loadingService.hide();
    
                    // ✅ Initialize map only after coords are updated
                    this.initMap();
                },
                error: () => {
                    this._loadingService.hide();
                }
            });
        }
    }
    updateOne() {
        this._router.navigate([`/home/sites/${this.site._id}/edit`]).then();
    }
    deleteOne() {
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
                this._siteService.deleteOne(this.site._id).subscribe(() => {});
                this._router.navigate(['/home/sites']).then();
            }
        });
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
      
        this.map.on('load', () => {
          console.log('Map loaded at:', this.lat, this.lng);
      
          this.marker = new mapboxgl.Marker()
            .setLngLat([this.lng, this.lat])
            //show its name 
            .setPopup(new mapboxgl.Popup().setHTML(`<h4>${this.site.name}</h4>`))
        
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
