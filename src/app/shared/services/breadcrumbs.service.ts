import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
interface Breadcrumb {
  label: string;
  url: string;
}
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const root = this.router.routerState.snapshot.root;
      this.breadcrumbs = this.getBreadcrumbs(root);
    });
  }

  getBreadcrumbs(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const label = route.data['breadcrumb'];
    const path = route.routeConfig?.path;

    if (label && path) {
      const nextUrl = `${url}/${route.url.map(segment => segment.path).join('/')}`;
      breadcrumbs.push({ label, url: nextUrl });
    }

    if (route.firstChild) {
      return this.getBreadcrumbs(route.firstChild, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}