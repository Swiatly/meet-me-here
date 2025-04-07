import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(private http: HttpClient) { }

  public searchUser(content: string, token: string) {
    return this.http.get<{users: any}>(`/api/user/search-users?phrase=${content}`, {headers: { authorization: `Bearer ${token}` }});
  }

  public followUser(userId: number, token: string) {
    return  this.http.post('/api/user/follow-user', {userId}, {headers: { authorization: `Bearer ${token}` }});
  }

  public unfollowUser(userId: number, token: string) {
    return this.http.post('/api/user/unfollow-user', {userId}, {headers: { authorization: `Bearer ${token}` }});
  }
}
