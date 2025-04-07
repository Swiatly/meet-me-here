import { Component, OnInit}  from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FriendsService } from 'src/app/services/friends.service';
import { PostService } from 'src/app/services/post.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  public person: any = {};
  public otherPerson: any = {};
  public dataOther: any = {};
  public name: string = ''
  public biogram: string = '';
  public location: string = ''
  public birthday: string = '';
  public picture: string = './../../../assets/domyslneProfilowe.png';
  public followers: any = [];
  public following: any = [];

  public userPosts: any;
  public userId: any;
  public isOtherUser: boolean = false;
  public isFollowing: boolean = false;

  constructor(private postService: PostService, private authService: AuthService, private activatedRoute: ActivatedRoute, private profileService: ProfileService, private friends: FriendsService) { 
  }

  ngOnInit(): void {
    this.person = this.authService.getUser();
    
    if(this.activatedRoute.snapshot.params['id'] === undefined) {
      this.initData();
      this.getUserPosts();
      this.isOtherUser = false;
    }
    else {
      let token = this.authService.getToken();
      let id = this.activatedRoute.snapshot.params['id'];
      if(id && token) {
        this.profileService.fetchUserData(id, token).subscribe((data) => {
          this.dataOther = data
          this.otherPerson = this.dataOther.user
          this.userPosts = this.dataOther.userPosts
          this.initDataForOtherUser()
          this.isOtherUser = true;
          this.checkIsFollowing();
        });
      }
    }
  }

  public getPostsAfterDelete() {
    
    this.getUserPosts();
  }

  public getProfileId() {
    if(this.activatedRoute.snapshot.params['id'] === undefined) {
      return this.person.id.toString();
    }
    else {  
      return this.activatedRoute.snapshot.params['id'];
    }
  };

  public checkIsFollowing() {
    if(this.person.followedUsers.length > 0) {
      
      for(let person of this.person.followedUsers) {
        if(person.following.id === Number(this.activatedRoute.snapshot.params['id'])) {
          this.isFollowing = true;
        }
        else {
          this.isFollowing = false
        }
      }
    }
    else {
      this.isFollowing = false
    }
  }

  public followUser() {
    let id = this.activatedRoute.snapshot.params['id'];
    let token = this.authService.getToken();
    if(id && token) {
      this.friends.followUser(id, token).subscribe((data) => {
        if(data) {
          this.isFollowing = true;

          let token = this.authService.getToken();
          let id = this.activatedRoute.snapshot.params['id'];
          if(id && token) {
            this.profileService.fetchUserData(id, token).subscribe((data) => {
              this.dataOther = data
              this.otherPerson = this.dataOther.user
              this.userPosts = this.dataOther.userPosts
              this.initDataForOtherUser()
              this.isOtherUser = true;
            });
          }
        }
      })
    }
  }

  public unfollowUser() {
    let id = this.activatedRoute.snapshot.params['id'];
    let token = this.authService.getToken();
    if(id && token) {
      this.friends.unfollowUser(id, token).subscribe((data) => {

          this.isFollowing = false;
        console.log('dupa');
        
          let token = this.authService.getToken();
          let id = this.activatedRoute.snapshot.params['id'];
          if(id && token) {
            this.profileService.fetchUserData(id, token).subscribe((data) => {
              this.dataOther = data
              this.otherPerson = this.dataOther.user
              this.userPosts = this.dataOther.userPosts
              this.initDataForOtherUser()
              this.isOtherUser = true;
            });
          
        }
      })
    }
  }

  public deletePost(postId: number) {
    let token = this.authService.getToken();
    if(token) {
      this.postService.deletePost(postId, token).subscribe((data) => {
        if(data) {
          this.getUserPosts();
        }
      });
    } 
  }

  private getUserPosts() {
    let token = this.authService.getToken();
    if(token && this.userId) {
      this.profileService.getUserPosts(this.userId, token).subscribe((data) => {
        this.userPosts = data;
      })
    }
  }
  
  private returnDataFormat(date: string) {
    return date.split('T')[0];
  }

  private initData() {
    if(this.person.id) {
      this.userId = this.person.id
    }

    if(this.person.firstName && this.person.lastName) {
      this.name = `${this.person.firstName} ${this.person.lastName}`
    }
    if(this.person.biogram && this.person.biogram.length > 0) {
      this.biogram = this.person.biogram;
    }
    if(this.person.location && this.person.location.length > 0) {
      this.location = this.person.location;
    }
    if(this.person.birthdate) {
      var dateObj = new Date(this.person.birthdate);
      let month = dateObj.toLocaleString('default', { month: 'long' }); 
      let day = dateObj.getUTCDate();

    this.birthday =  day + ' ' + month;
    }
    if(this.person.followers && this.person.followers.length > 0) {
      this.followers = this.person.followers;
    }
    if(this.person.followedUsers && this.person.followedUsers.length > 0) {
      this.following = this.person.followedUsers;
    }
    if(this.person.profilePicture) {
      this.picture = `./../../../assets/${this.person.profilePicture}`
    }
  }

  private initDataForOtherUser() {
    if(this.otherPerson.id) {
      this.userId = this.otherPerson.id
    }

    if(this.otherPerson.firstName && this.otherPerson.lastName) {
      this.name = `${this.otherPerson.firstName} ${this.otherPerson.lastName}`
    }
    if(this.otherPerson.biogram && this.otherPerson.biogram.length > 0) {
      this.biogram = this.otherPerson.biogram;
    }
    if(this.otherPerson.location && this.otherPerson.location.length > 0) {
      this.location = this.otherPerson.location;
    }
    if(this.otherPerson.birthdate) {
      var dateObj = new Date(this.otherPerson.birthdate);
      let month = dateObj.toLocaleString('default', { month: 'long' }); 
      let day = dateObj.getUTCDate();

    this.birthday =  day + ' ' + month;
    }
    if(this.otherPerson.followers && this.otherPerson.followers.length > 0) {
      this.followers = this.otherPerson.followers;
    }
    if(this.otherPerson.followedUsers && this.otherPerson.followedUsers.length > 0) {
      this.following = this.otherPerson.followedUsers;
    }
    if(this.otherPerson.profilePicture) {
      this.picture = `./../../../assets/${this.otherPerson.profilePicture}`
    }
  }
}
