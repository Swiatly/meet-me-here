import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() title: string = '';
  @Input() date: string = '';
  @Input() author: string = '';
  @Input() description: string ='';
  @Input() photo: string = '';
  @Input() amountOfLikes: number = 0;
  @Input() delete: boolean = false;
  @Input() postID: number = 0;

  @ViewChild('modal') modal: ElementRef | undefined;

  @Output() public getPosts: EventEmitter<any> = new EventEmitter();

  public comments: any = [ ]

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getComments();
  }

  public openModal() {
    this.modal?.nativeElement.classList.add('show');
    this.modal?.nativeElement.classList.remove('close');
  }

  public closeModal() {
    this.modal?.nativeElement.classList.add('close');
    this.modal?.nativeElement.classList.remove('add');
  }

  public deletePost() {
    let token = this.authService.getToken(); 

    if(token) {
      this.postService.deletePost(this.postID, token).subscribe((data) => {
        if(data) {
          this.getPosts.emit();
        }
      })
    }
  }

  public addComment(content: string) {
    if(this.comments) {
      let token = this.authService.getToken();
      if(token) {
        this.postService.addComment(this.postID, content, token).subscribe((data) => {
          if(data) {
            this.getComments();
          }
        })
      }
    }
  }

  public addLike() {
    if(this.postID) {
      let token = this.authService.getToken();
      if(token) {
        this.postService.addLikeToPost(this.postID, this.amountOfLikes + 1, token).subscribe((data) => {
          if(data) {
            this.getDetails();
          }
        });
      }
    }
  }

  private getDetails() {
    this.postService.getPostDetails(this.postID).subscribe((data) => {
      if(data) {
        let post: any;
        post = data

        if(post) {
          this.amountOfLikes = post.likes;
        }
      }
      
    })
  }

  private getComments() {
    if(this.postID) {
      let token = this.authService.getToken();
      if(token) {
        this.postService.getCommentsForPost(this.postID, token).subscribe((data) => {
          console.log(data)
          this.comments = data
        });
        
      }
    }
  }
}
