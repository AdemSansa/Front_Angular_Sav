import {Component, inject, OnInit} from '@angular/core';
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
    lat: number = 36.8065; // Default latitude (e.g., Tunis)
    lng: number = 10.1815; // Default longitude (e.g., Tunis)
    ngOnInit(): void {
     
        if (this.id) {
            this._loadingService.show()
            forkJoin([
                this._siteService.getOne(this.id),
            ]).subscribe({
                next: (result:[Site ]) => {
                    this.site = result[0];
                    this.lat = this.site.latitude || 36.8065; // Default latitude (e.g., Tunis)
                    this.lng = this.site.longitude || 10.1815; // Default longitude (e.g., Tunis)
                    console.log(this.site.longitude,this.site.latitude);
                    

                    this._companyService.getOne(this.site.companyId).subscribe({
                        next: (company) => {
                            this.site.companyName = company.name;
                        },
                        error: () => {
                            this._loadingService.hide()
                        }
                    });
                    this._loadingService.hide()
                },
                error: () => {
                    this._loadingService.hide()
                }
            });
        }
        this.initMap()
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

    map: any;
  marker: any;
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
