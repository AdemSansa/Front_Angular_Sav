import {inject, Injectable} from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../models/pagination';
import { Complaint } from '../models/complaint';
@Injectable({
  providedIn: 'root',
})
export class ComplaintService {
  endpoint = `${environment.api}/complaints`;
  http = inject(HttpClient)
  getList(
      limit: string,
      page: string,
      search: string,
      filterType:string,
      filterStatus:string,
  ): Observable<Pagination<Complaint>> {
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
    return this.http.get<Pagination<Complaint>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  getAll(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.endpoint}/all`);
  }
  deleteOne(id: string): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }
  getOne(id: string): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.endpoint}/${id}`);
  }
    createOne(complaint: Complaint): Observable<null> {
    return this.http.post<any>(`${this.endpoint}`, { complaint });
  }
  updateOne(complaint: Complaint): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/${complaint._id}`, { complaint });
  }
  assignTechnician(complaintId:string,technicianId:string): Observable<null> {
    return this.http.post<null>(`${this.endpoint}/assign`, { complaintId, technicianId });
  }
  getSubmittedComplaints( limit: string,
    page: string,
    search: string,
    filterType:string,
    filterStatus:string,
): Observable<Pagination<Complaint>> {
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
  return this.http.get<Pagination<Complaint>>(`${this.endpoint}/requests/submitted`, {
    params: searchParams,
  });
}
getMywork(id:string)
: Observable<Pagination<Complaint>> {
  let searchParams = new HttpParams();
  searchParams = searchParams.append('id', id);
  return this.http.get<Pagination<Complaint>>(`${this.endpoint}/requests/my-work`, {
    params: searchParams,
  }
  );
}
startWorking(id:string): Observable<null> {
  return this.http.post<null>(`${this.endpoint}/requests/my-work/${id}`, {});

}
getDischargePdf(code:string): Observable<Blob> {
  return this.http.get(`${this.endpoint}/${code}/pdf`, { responseType: 'blob' });
}
getUnderReviwedComplaints( limit: string,
  page: string,
  search: string,
  filterType:string,
  filterStatus:string,
): Observable<Pagination<Complaint>> {

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
  return this.http.get<Pagination<Complaint>>(`${this.endpoint}/requests/under-reviewed`, {
    params: searchParams,
  });
}

  
}


