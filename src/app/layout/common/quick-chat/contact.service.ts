import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Contact } from './quick-chat.types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

 http=inject(HttpClient);

  readonly api = `${environment.api}/contacts`;
  /**
   * Constructor
   */
  constructor()
  {
  }
  // -----------------------------------------------------------------------------------------------------
  getList():Observable<Contact[]>
  {
    return this.http.get<Contact[]>(this.api)
    
  }
  createOne(contact:Contact):Observable<Contact>
  {
    return this.http.post<Contact>(this.api,{contact})
  }
  
}
