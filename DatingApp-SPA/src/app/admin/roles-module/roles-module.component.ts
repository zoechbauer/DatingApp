import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-roles-module',
  templateUrl: './roles-module.component.html',
  styleUrls: ['./roles-module.component.css']
})
export class RolesModuleComponent implements OnInit {
  user: User;
  @Output() updateSelectedRoles = new EventEmitter();
  roles: any[];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }

  updateUserRoles() {
    this.updateSelectedRoles.emit(this.roles);
    this.bsModalRef.hide();
  }
}
