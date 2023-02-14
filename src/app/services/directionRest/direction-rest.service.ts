import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StationRestService {
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient
  ) { }

  createDirection(params: {}) {
    return this.http.post(environment.URL + 'direction/createDirection', params, { headers: this.httpOptions });
  }

  updateDirection(id: string, params: {}) {
    return this.http.put(environment.URL + 'direction/updateDirection/' + id, params, { headers: this.httpOptions });
  }

  deleteDirection(id: string) {
    return this.http.delete(environment.URL + 'direction/deleteDirection/' + id, { headers: this.httpOptions });
  }

  getDirections() {
    return this.http.get(environment.URL + 'direction/getDirections', { headers: this.httpOptions })
  }

  getDirection(id: string) {
    return this.http.get(environment.URL + 'direction/getDirection/' + id, { headers: this.httpOptions })
  }

}
