
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {  Router, RouterLink, RouterOutlet } from '@angular/router';
import {FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent} from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import {MenuService} from "../../../../shared/services/menu.service";
import { UserOpComponent } from 'app/layout/common/user/user.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Breadcrumb } from 'xng-breadcrumb/lib/types';
import { BreadcrumbService } from 'xng-breadcrumb';
import { QuickChatComponent } from "../../../common/quick-chat/quick-chat.component";

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [FuseVerticalNavigationComponent, MatIconModule, MatButtonModule, UserOpComponent, RouterLink, RouterOutlet, MatToolbarModule, QuickChatComponent]
})
export class ClassyLayoutComponent implements OnInit, OnDestroy
{
    isScreenSmall: boolean;
    navigation: FuseNavigationItem[];
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isLoading: boolean = true;
    userInfo: any;
    breadcrumbs: Breadcrumb[] = [];

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
                console.log('this.navigation', this.navigation)
            },
            error: () => {},
        });


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
