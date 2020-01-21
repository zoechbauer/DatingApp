import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { AuthService } from '../_Services/Auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_Services/alertify.service';
import { UserService } from '../_Services/User.service';
import { MobileService } from '../_Services/mobile.service';

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
  headerFromToText = 'From / To';
  headerSentReceivedText = 'Sent / Received';

  constructor(private authService: AuthService, private userService: UserService,
              private route: ActivatedRoute, private alertify: AlertifyService,
              private mobileService: MobileService) { }

  ngOnInit() {
    this.route.data.subscribe( data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
    this.setButtonText();
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
    console.log('messages pageChanged:', this.pagination, event);
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  onResize(event: any): void {
    this.setButtonText();
  }

  setButtonText(): void {
    this.isMobileDevice = this.mobileService.isMobileDevice();
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
