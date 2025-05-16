import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentRegistryService {
  private currentComponent: any = null;

  registerComponent(component: any) {
    this.currentComponent = component;
  }

  unregisterComponent(component: any) {
    if (this.currentComponent === component) {
      this.currentComponent = null;
    }
  }

  getCurrentComponent() {
    return this.currentComponent;
  }
} 