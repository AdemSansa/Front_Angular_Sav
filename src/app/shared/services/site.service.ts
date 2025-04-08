import {inject, Injectable} from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../models/pagination';
import { Site } from '../models/site';
@Injectable({
  providedIn: 'root'
})
export class SiteService {
 endpoint = `${environment.api}/sites`;
  http = inject(HttpClient)
  getList(
      limit: string,
      page: string,
      search: string,
      filterType:string,
      filterStatus:string,
  ): Observable<Pagination<Site>> {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('limit', limit);
    searchParams = searchParams.append('page', page);
    if (search) {
      searchParams = searchParams.append('search', search);
    }
    if (filterType) {
      searchParams = searchParams.append('filterType', filterType);
    }
    if (filterStatus) {
      searchParams = searchParams.append('filterStatus', filterStatus);
    }
    return this.http.get<Pagination<Site>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  getAll(): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.endpoint}/all`);
  }
  deleteOne(id: string): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }

  getOne(id: string): Observable<Site> {
    return this.http.get<Site>(`${this.endpoint}/${id}`);
  }
    createOne(site: Site): Observable<null> {
    return this.http.post<any>(`${this.endpoint}`, { site });
  }
  updateOne(site: Site): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/${site._id}`, { site });
  }
}
