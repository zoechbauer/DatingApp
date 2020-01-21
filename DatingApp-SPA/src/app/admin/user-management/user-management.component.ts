import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_Services/admin.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RolesModuleComponent } from '../roles-module/roles-module.component';
import { MobileService } from 'src/app/_Services/mobile.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[];
  bsModalRef: BsModalRef;
  isMobileDevice: boolean;

  constructor(private adminService: AdminService, private alertify: AlertifyService,
              private modalService: BsModalService, private mobileService: MobileService) { }

  ngOnInit() {
    this.getUsersWithRoles();
    this.onResize(null);
  }

  onResize(event) {
    this.isMobileDevice = this.mobileService.isMobileDevice();
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

  EditRolesModal(user: User) {
    const initialState = {
      user,
      roles : this.getUserRolesArray(user),
    };
    console.log('initialState', initialState);
    this.bsModalRef = this.modalService.show(RolesModuleComponent, {initialState});
    this.bsModalRef.content.updateSelectedRoles.subscribe(values => {
      const rolesToUpdate = {
        roleNames: [...values.filter(el => el.checked === true).map(el => el.name)]
      };
      console.log('rolesToUpdate', rolesToUpdate);
      this.adminService.updateUserRoles(user, rolesToUpdate).subscribe(() => {
        user.roles = [...rolesToUpdate.roleNames];
      }, error => {
        console.log(error);
      });
    });
  }

  getUserRolesArray(user: User): any[] {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'Moderator', value: 'Moderator'},
      {name: 'Member', value: 'Member'},
      {name: 'VIP', value: 'VIP'}
    ];

    for (let i = 0; i < availableRoles.length; i++) {
      let isMatch = false;
      for (let j = 0; j < userRoles.length; j++) {
        if (availableRoles[i].name === userRoles[j]) {
          isMatch = true;
          availableRoles[i].checked = true;
          break;
        }
      }
      if (!isMatch) {
        availableRoles[i].checked = false;
      }
      roles.push(availableRoles[i]);
    }
    // console.log('roles', roles);
    return roles;
  }
}
