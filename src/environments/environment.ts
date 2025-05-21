// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { SETTINGS } from './settings';

export const environment = {
  production: false,
  appSettings: SETTINGS,
  googleMapsApiKey: 'AIzaSyBSvo0x8v3C6aFWcSi2zooOC9tqGCOqCj4',
  portGraphql: "4100",
  apiUrl: 'http://linux.copiloto.com.br:3000',
  wsUrl: 'ws://linux.copiloto.com.br:3000',
  // apiUrl: 'http://192.168.0.9:5001/api',
  // wsUrl: 'ws://192.168.0.9:5001'
};
