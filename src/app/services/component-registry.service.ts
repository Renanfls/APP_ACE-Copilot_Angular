import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentRegistryService {
  private currentComponent: any = null;

  registerComponent(component: any) {
    console.log('📝 Registering component:', component.constructor.name);
    this.currentComponent = component;
  }

  unregisterComponent(component: any) {
    console.log('📝 Unregistering component:', component.constructor.name);
    if (this.currentComponent === component) {
      this.currentComponent = null;
    }
  }

  getCurrentComponent() {
    console.log('📝 Getting current component:', this.currentComponent?.constructor.name);
    return this.currentComponent;
  }
} 