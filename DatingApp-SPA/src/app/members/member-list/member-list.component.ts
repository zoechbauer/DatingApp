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
      // console.log('Member-list pagination', this.pagination);
    });

    this.userParams.gender = this.user.gender === 'female' ?  'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }

  resetFilters() {
    this.userParams.gender = this.user.gender === 'female' ?  'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
    this.loadUsers();
  }

  pageChanged(event: any): void {
    console.log('pageChanged:', this.pagination, event);
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    console.log('load users start- pagination', this.pagination);
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
        console.log('load users subscr - users', this.users);
        console.log('load users subscr - pagination', this.pagination);
        console.log('load users subscr - userParams', this.userParams);
      }, error => {
        this.alertify.error(error);
      });
  }
}
