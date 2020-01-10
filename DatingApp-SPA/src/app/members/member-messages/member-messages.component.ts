import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_Services/User.service';
import { AuthService } from 'src/app/_Services/Auth.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private userService: UserService,
              private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
      .pipe(
        tap(messages => {
          messages.forEach(message => {
            if (message.isRead === false && message.recipientId === currentUserId) {
              this.userService.markAsRead(currentUserId, message.id);
              // console.log('Message read: userid=' + currentUserId + ', msgId=' + message.id);
            }
          });
        })
      )
      .subscribe(messages => {
        this.messages = messages;
        // console.log(messages);
      }, error => {
        this.alertify.error(error);
      });
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe((message: Message) => {
        // console.log(message);
        this.messages.unshift(message);
        this.newMessage.content = '';
    }, error => {
      this.alertify.error(error);
    });
  }

}
