import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { History } from '../models/history';
import { Pagination } from '../models/pagination';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
endpoint = `${environment.api}/history`;
  http = inject(HttpClient)
  getList(
      limit: string,
      page: string,
      search: string,
      filterType:string,
      filterStatus:string,
      complaintId:string,
  ): Observable<Pagination<History>> {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('limit', limit);
    searchParams = searchParams.append('page', page);
    searchParams = searchParams.append('complaintId', complaintId);
  
    
    
    if (search) {
      searchParams = searchParams.append('search', search);
    }
    if (filterType) {
      searchParams = searchParams.append('filterType', filterType);
    }
    if (filterStatus) {
      searchParams = searchParams.append('filterStatus', filterStatus);
    }
    return this.http.get<Pagination<History>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  getAll(): Observable<History[]> {
    return this.http.get<History[]>(`${this.endpoint}/all`);
  }
  deleteOne(id: string): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }
  getOne(id: string): Observable<History> {
    return this.http.get<History>(`${this.endpoint}/${id}`);
  }
    createOne(history: History): Observable<null> {
    return this.http.post<null>(`${this.endpoint}`, { history });
  }
  updateOne(history: History): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/${history._id}`, { history });
  }
}
