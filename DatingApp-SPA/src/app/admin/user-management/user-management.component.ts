import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_Services/admin.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[];

  constructor(private adminService: AdminService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    return this.adminService.getUsersWithRoles().subscribe((users: User[]) => {
      this.users = users;
      console.log('users:', users);
    }, error => {
      console.log(error);
      this.alertify.error(error);
    });
  }

}
