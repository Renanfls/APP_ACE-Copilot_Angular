import { SETTINGS } from './settings';

export const environment = {
  production: true,
  appSettings: SETTINGS,
  googleMapsApiKey: 'AIzaSyBSvo0x8v3C6aFWcSi2zooOC9tqGCOqCj4',
  portGraphql: "3000",
  apiUrl: 'http://192.168.0.9:5001/api', // IP de casa
  // apiUrl: 'http://192.168.15.29:5001/api', // IP do trabalho
  wsUrl: 'ws://192.168.0.9:5001'
};
