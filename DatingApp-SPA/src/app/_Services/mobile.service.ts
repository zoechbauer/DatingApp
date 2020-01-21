import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileService {
  private isSmallMobileDevice: MediaQueryList = window.matchMedia('(max-width: 999px)');   // mobile: 599px

constructor() { }

isMobileDevice(): boolean {
  // console.log('isSmallMobileDevice', this.isSmallMobileDevice);
  if (this.isSmallMobileDevice.matches) {
    return true;
  } else {
    return false;
  }
}

}
