import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {



  constructor(private http: HttpClient) { 
  }



  public addComment(commentedUserId: number, content: string, token: string) {
    return this.http.post('/api/user/comment-user', {commentedUserId, content}, {headers: { authorization: `Bearer ${token}` }})
  }

  public changeData(firstname: string, lastname: string, birthDate: string, location: string, biogram: string, picture: string, token: string | null) {
    const response = this.http.patch('/api/user/change-data', {firstname, lastname, birthDate: new Date(birthDate).getTime(), location, biogram, picture}, 
    {headers: { authorization: `Bearer ${token}` }}).subscribe((data) => {
    })
  }

  public getComments(userId: string, token: string) {
    return this.http.get(`/api/user/get-profile-comments/${userId}`,{headers: { authorization: `Bearer ${token}` }})
  }

  public fetchUserData(userId: string, token: string) {
    return this.http.get(`/api/user/user-profile/${userId}`,{headers: { authorization: `Bearer ${token}` }})
  }

  public getUserPosts(userId: string, token: string) {
    return this.http.get(`/api/post/get-user-posts/${userId}`, {headers: { authorization: `Bearer ${token}` }});
  }
}
