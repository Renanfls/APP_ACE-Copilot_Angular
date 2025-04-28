import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError as observableThrowError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NavigationStart, Router } from '@angular/router';
import { EnvService } from '../../env.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient,
              private router: Router, 
              private env: EnvService) { }

  navigate(path:string) {
    this.router.navigate([path]);
  } 

  getData(source: string) {
    return this.http.get(source).pipe(
      tap((res: any) => res),
      catchError(this.handleError)
    );
  }
//application/json

  getEnv() {
    return this.env;
  }

  getServerURL() {
    // console.log(`getServerURL`, this.env.apiUrl);
    // if ((!this.env.apiUrl) || (this.env.apiUrl.length == 0)) { this.env.apiUrl = "192.168.2.150"; }
    return this.env.apiUrl; //"192.168.2.150";//"linux.copiloto.com.br";//"wwc.copiloto.com.br"
  }

  getDataGraphql(source: string, graphqlQuery: { query: string }, versao:number) {
    if (versao === 2) {
      const formData = new FormData();
      const teste = JSON.stringify(graphqlQuery);
      formData.append("teste", teste);
      return this.http.post(source, formData, 
                  { headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                  }) }).pipe(
        tap((res: any) => res),
        catchError(this.handleError)
      );
    } else {
      return this.http.post(source, JSON.stringify(graphqlQuery), 
                  { headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                  }) }).pipe(
        tap((res: any) => res),
        catchError(this.handleError)
      );
    }
  }
    
  private handleError(error: any) {
    console.log(error);
    return observableThrowError(error.error || 'Server error');
  }
  
}
