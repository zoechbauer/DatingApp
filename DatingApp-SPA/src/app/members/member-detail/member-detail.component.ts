import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserService } from 'src/app/_Services/User.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';
import { AuthService } from 'src/app/_Services/Auth.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserService, private alertify: AlertifyService,
              private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe( data => {
      // we can access the resolved data of member-edit.resolver
      // using the data property of Activated Route, the key is defined in routes.ts
      // see https://alligator.io/angular/route-resolvers/
      this.user = data['user'];
      }
    );

    this.route.queryParams.subscribe( params => {
      const tab = params['tab'];
      this.selectTab(tab);
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for (const photo of this.user.photos) {
      imageUrls.push( {
        small: photo.url,
        medium: photo.url,
        big: photo.url
      });
    }
    return imageUrls;
  }

  selectTab(tabId: number) {
    // console.log('selectedTab of tabId', tabId);
    if (tabId !== undefined) {
      this.memberTabs.tabs[tabId].active = true;
    }
  }

  sendLike(id: number) {
    // console.log('decodedToken: ', this.authService.decodedToken);
    this.userService.sendLike(this.authService.decodedToken.nameid, id).subscribe(
      res => {
        this.alertify.success('you liked ' + this.user.knownAs);
      }, error => {
        this.alertify.error(error);
      }
    );
  }
}
