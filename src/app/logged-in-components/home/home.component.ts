import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private postService: PostService, private authService: AuthService) { }

  public posts: any = [
  ];
  public person: any = {};

  ngOnInit(): void {
    this.person = this.authService.getUser();
    this.getPostsFollowedUsers();
  }

  private getPostsFollowedUsers() {
    if(this.person.followedUsers.length > 0) {
      let token = this.authService.getToken();
      if(token) {
        for(let followed of this.person.followedUsers) {
          this.postService.getPostsFollowedUsers(followed.following.id, token).subscribe((data) => {
            let usersAndPosts: any = []
            usersAndPosts = data
            if(usersAndPosts.length > 0) {
              for(let element of usersAndPosts) {
                this.posts.push(element)
              }
            }
        })
      }
    } 
    }
}

}
