import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  public createPost(title: string | undefined, desc: string | undefined, token: string | null, photo?: string | undefined) {
    const response = this.http.post('/api/post/create', {title, desc, photo}, {headers: { authorization: `Bearer ${token}` }}).subscribe((data) => {
      
  });
  }

  public getPostDetails(postId: number) {
    return this.http.get(`/api/post/get-likes/${postId}`)
  }

  public addComment(postId: number, content: string, token: string) {
    return this.http.post('/api/post/add-comment', {postId, content}, {headers: { authorization: `Bearer ${token}` }})
  }

  public getCommentsForPost(postId: number, token: string) {
    return this.http.post('/api/post/get-comments-for-post', {postId}, {headers: { authorization: `Bearer ${token}` }})
  }

  public getPostsFollowedUsers(userId: number, token: string) {
    return this.http.post('/api/post/get-followed-users-posts', {userId}, {headers: { authorization: `Bearer ${token}` }})
  }

  public addLikeToPost(postId: number, likesAmount: number, token: string) {
    return this.http.patch('/api/post/add-like', {postId, likesAmount}, {headers: { authorization: `Bearer ${token}` }})
  }

  public deletePost(postId: number, token: string) {
    return this.http.post('/api/post/delete-post', {postId}, {headers: { authorization: `Bearer ${token}` }})
  }
}