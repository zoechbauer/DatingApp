import { Component, OnInit } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_Services/admin.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
  photos: any[] = [];

  constructor(private adminService: AdminService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
    return this.adminService.getPhotosForApproval().subscribe((photos: any[]) => {
      console.log('photos', photos);
      this.photos = photos;
    }, error => {
      console.log(error);
      this.alertify.error('ERROR: ' + error);
    });
  }

  approvePhoto(id: number) {
    console.log('approvePhoto id:', id);
    this.adminService.approvePhoto(id).subscribe(() => {
      const index: number = this.photos.findIndex(p => p.id === id);
      this.photos.splice(index, 1);
    }, error => {
      console.log(error);
      this.alertify.error('ERROR: ' + error);
    });
  }

  rejectPhoto(id: number) {
    this.adminService.rejectPhoto(id).subscribe(() => {
      const index: number = this.photos.findIndex(p => p.id === id);
      this.photos.splice(index, 1);
    }, error => {
      console.log(error);
      this.alertify.error('ERROR: ' + error);
    });
  }

}
