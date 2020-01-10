import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { AuthService } from '../_Services/Auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_Services/alertify.service';
import { UserService } from '../_Services/User.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  deleteBtnText = 'Delete';
  isMobileDevice = true;
  isSmallMobileDevice: MediaQueryList = window.matchMedia('(max-width: 999px)');   // mobile: 599px
  headerFromToText = 'From / To';
  headerSentReceivedText = 'Sent / Received';

  constructor(private authService: AuthService, private userService: UserService,
              private route: ActivatedRoute, private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe( data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
    this.onResize(null);
  }

  loadMessages() {
    this.userService.getMessages(this.authService.decodedToken.nameid,
        this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
      .subscribe( (res: PaginatedResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
        // console.log(this.messages);
      }, error => {
        this.alertify.error(error);
      });
    this.setButtonText();
  }

  deleteMessage(id: number) {
    this.alertify.confirm('Are you sure you want to delete this message?', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(() => {
          this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
          this.alertify.success('This message has been deleted');
      }, error => {
        this.alertify.error('Failed to delete the message');
      });
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  onResize(event: any): void {
    // console.log('isSmallMobileDevice', this.isSmallMobileDevice);
    if (this.isSmallMobileDevice.matches) {
      this.isMobileDevice = true;
    } else {
      this.isMobileDevice = false;
    }
    this.setButtonText();
  }

  setButtonText(): void {
    // message load buttons
    if (this.messageContainer.toLowerCase() === 'outbox') {
      this.headerSentReceivedText = 'Sent';
      this.headerFromToText = 'To';
    } else {
      if (this.isMobileDevice) {
        this.headerSentReceivedText = 'Rec.';
      } else {
        this.headerSentReceivedText = 'Received';
      }
      this.headerFromToText = 'From';
    }
    // delete button
    if (this.isMobileDevice) {
      this.deleteBtnText = '';
    } else {
      this.deleteBtnText = 'Delete';
    }
  }

}
