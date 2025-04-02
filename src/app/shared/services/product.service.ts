import {inject, Injectable} from '@angular/core';

import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '../models/pagination';
import { Product } from '../models/product';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  endpoint = `${environment.api}/products`;
  http = inject(HttpClient)
  getList(
      limit: string,
      page: string,
      search: string,
      filterType:string,
      filterStatus:string,
  ): Observable<Pagination<Product>> {
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
    return this.http.get<Pagination<Product>>(`${this.endpoint}`, {
      params: searchParams,
    });
  }
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.endpoint}/`);
  }
  deleteOne(id: string): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${id}`);
  }
  getOne(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.endpoint}/${id}`);
  }
    createOne(product: Product): Observable<null> {
    return this.http.post<null>(`${this.endpoint}`, { product });
  }
  updateOne(product: Product): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/${product._id}`, { product });
  }
}
