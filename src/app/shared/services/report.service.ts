import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Pagination } from '../models/pagination';
import { Observable } from 'rxjs';
import { Report } from '../models/report';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
 endpoint = `${environment.api}/reports`;
  http = inject(HttpClient)
  getList(
      limit: string,
      page: string,
      search: string,
      filterType:string,
      filterStatus:string,
  ): Observable<Pagination<Report>> {
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
    return this.http.get<Pagination<Report>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  getAll(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.endpoint}/all`);
  }
  deleteOne(id: string): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }
  getOne(id: string): Observable<Report> {
    return this.http.get<Report>(`${this.endpoint}/${id}`);
  }
    createOne(report: Report): Observable<null> {
    return this.http.post<null>(`${this.endpoint}`, { report });
  }
  updateOne(report: Report): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/${report._id}`, { report });
  }

 getByComplaintId(complaintId: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.endpoint}/complaint/${complaintId}`);
 }
}
