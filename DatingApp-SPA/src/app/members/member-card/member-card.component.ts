import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_Services/Auth.service';
import { UserService } from 'src/app/_Services/User.service';
import { AlertComponent } from 'ngx-bootstrap';
import { AlertifyService } from 'src/app/_Services/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;

  constructor(private authService: AuthService, private userService: UserService,
              private alertify: AlertifyService) { }

  ngOnInit() {
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
