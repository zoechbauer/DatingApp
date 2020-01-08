import { Component, OnInit } from '@angular/core';
import { UserService } from '../_Services/User.service';
import { AlertifyService } from '../_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { AuthService } from '../_Services/Auth.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;
  likesOfGenderShown: string;
  likesOfGenderNotShown: string;

  constructor(private authService: AuthService, private route: ActivatedRoute, private userService: UserService,
              private alertyService: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      // console.log('Lists data', data);
      // console.log('User', this.authService.currentUser);
      if (this.authService.currentUser.gender !== null) {
        this.likesOfGenderShown = this.authService.currentUser.gender === 'male' ? 'Female' : 'Male';
        this.likesOfGenderNotShown = this.authService.currentUser.gender;
      }
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
      this.likesParam = 'Likers';
      // console.log('Lists pagination', this.pagination);
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    // console.log(this.pagination);
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertyService.error(error);
      });
  }

}
