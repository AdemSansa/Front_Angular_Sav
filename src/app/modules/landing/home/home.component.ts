import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/shared/models/user';
import { MenuService } from 'app/shared/services/menu.service';
import { UserService } from 'app/shared/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Breadcrumb } from 'xng-breadcrumb/lib/types';
import { translocoConfig, TranslocoConfig } from '@ngneat/transloco';
@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatButtonModule, RouterLink, MatIconModule,],
})
export class LandingHomeComponent implements OnInit, OnDestroy
{
    isScreenSmall: boolean;
    navigation: FuseNavigationItem[];
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isLoading: boolean = true;
    userInfo: any;
    breadcrumbs: Breadcrumb[] = [];
    featuresList: any[] = [];

    /**
     * Constructor
     */
    constructor(
        private menuService: MenuService,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
    )
    {
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    breadcrumbsService = inject(BreadcrumbService);
    ngOnInit(): void
    {
       
 
        this.breadcrumbsService.breadcrumbs$.subscribe((breadcrumbs: Breadcrumb[]) => {
            this.breadcrumbs = breadcrumbs;
            console.log('this.breadcrumbs', this.breadcrumbs);
            
        }
        );
        this.menuService.getMenu().subscribe({
            next: (data) => {
                this.navigation = data.menu;
                this.navigation.forEach((item) => {
                    
                    if (item.children) {
                           
                                this.featuresList[item.code] = item.children;
                            
                        
                    }
                }   );

                console.log('this.navigation', this.navigation);

                console.log('this.featuresList', this.featuresList);
                
            }
        }
        );


        // Subscribe to the user service
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) =>
            {
                this.user = user;
                console.log('user', user);
                
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) =>
            {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
            this._userService.get().subscribe((user) => {
                this.userInfo = user;
                console.log('userInfo', this.userInfo);
            }
            );
            
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
