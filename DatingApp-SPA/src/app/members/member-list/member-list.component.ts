import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_Services/User.service';
import { AlertifyService } from '../../_Services/alertify.service';
import { User } from '../../_models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [
    {value: 'male', display: 'Males'},
    {value: 'female', display: 'Females'}
  ];
  userParams: any = {};
  pagination: Pagination;

  constructor(private userService: UserService, private alertify: AlertifyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log('Member-list data', data);
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.initFilter();
  }

  resetFilters() {
    this.initFilter();
    this.loadUsers();
  }

  initFilter() {
    this.userParams.gender = this.user.gender === 'female' ?  'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.users = res.result;
      }, error => {
        this.alertify.error(error);
      });
  }
}
