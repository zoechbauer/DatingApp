import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;

  constructor(public authService: AuthService, private alertify: AlertifyService,
              private router: Router) {}

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photo => this.photoUrl = photo);
  }

  login() {
     this.authService.login(this.model).subscribe(next => {
       this.alertify.success('Logged in successfully');
     }, error => {
       this.alertify.error('Failed to login');
       console.log('login error: ', error);
       console.log('login model: ', this.model);
     }, () => {
       this.router.navigate(['/members']);
     });
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    this.authService.decodedToken = null;
    localStorage.removeItem('user');
    this.authService.currentUser = null;
    this.alertify.success('logged out');
    this.router.navigate(['/home']);
  }

}
