import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-roles-module',
  templateUrl: './roles-module.component.html',
  styleUrls: ['./roles-module.component.css']
})
export class RolesModuleComponent implements OnInit {
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
