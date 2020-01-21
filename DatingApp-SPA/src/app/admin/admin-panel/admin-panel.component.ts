import { Component, OnInit } from '@angular/core';
import { MobileService } from 'src/app/_Services/mobile.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  headingUserManagement: string;
  headingPhotoManagement: string;

  constructor(private mobileService: MobileService) { }

  ngOnInit() {
    this.setHeading();
  }

  onResize(event: any): void {
    this.setHeading();
  }

  setHeading() {
    if (this.mobileService.isMobileDevice()) {
      this.headingUserManagement = 'User Mgmt';
      this.headingPhotoManagement = 'Photo Mgmt';
    } else {
      this.headingUserManagement = 'User Management';
      this.headingPhotoManagement = 'Photo Management';
    }
  }

}
