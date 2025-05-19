import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarouselStateService {
  private carouselCompleteSubject = new Subject<void>();
  carouselComplete$ = this.carouselCompleteSubject.asObservable();

  notifyCarouselComplete() {
    console.log('🎠 Carousel complete notification sent');
    this.carouselCompleteSubject.next();
  }
} 