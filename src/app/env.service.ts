import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  // The values that are defined here are the default values that can
  // be overridden by env.js

  // API url
  public apiUrl = '';
  //linux.copiloto.com.br

  // Whether or not to enable debug mode
  public enableDebug = true;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

}
