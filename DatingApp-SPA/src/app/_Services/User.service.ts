import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(page?, itemsPerPage?, userParams?, likesParam?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (userParams !== null && userParams !== undefined) {
      params = params.append('gender', userParams.gender);
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('orderBy', userParams.orderBy);
    }
    if (likesParam === 'Likers') {
      params = params.append('Likers', 'true');
    }
    if (likesParam === 'Likees') {
      params = params.append('Likees', 'true');
    }
    // console.log('getUsers - params', params);
    return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params} )
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            // console.log('getUsers - response.headers.get(Pagination)', response.headers.get('Pagination'));
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          console.log('getUsers - paginatedResult', paginatedResult);
          return paginatedResult;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User)  {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  setPhotoMain(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
  }

  sendLike(id: number, recipientId: number) {
    // console.log('UserService.sendLike: ', id, recipientId);
    return this.http.post(this.baseUrl + 'users/' + id + '/likes/' + recipientId, {});
  }

  getMessages(id: number, page?, itemsPerPage?, messageContainer?): Observable<PaginatedResult<Message[]>> {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
    let params = new HttpParams();

    params = params.append('MessageContainer', messageContainer);
    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    console.log('getMessages - params', params);
    // console.log('messageContainer', messageContainer);

    // with oberserve: 'response' we get all data including the response headers and not only the json data
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          console.log('getMessages - response', response);
          console.log('getMessages - paginatedResult', paginatedResult);
          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
  }

  deleteMessage(id: number, userId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
  }

  markAsRead(userId: number, messageId: number) {
    this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {})
      .subscribe();
  }
}
