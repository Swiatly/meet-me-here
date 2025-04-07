import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @ViewChild('modal') modal: ElementRef | undefined;
  @ViewChild('comment') commentInput: ElementRef<HTMLInputElement> | undefined;
  @Input('userId') profileId: any;

  public token: string | null = '';
  public commentsList: any = [
  ]

  constructor(private profileService: ProfileService, private authService: AuthService) { }

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
    this.clearInput();
  }

  private getComments(): void {
    let token = this.authService.getToken();
    if(token) {
      this.profileService.getComments(this.profileId, token).subscribe((data) => {
        if(data) {
          this.commentsList = data;
          console.log(this.commentsList.comments);
          
        }
      })
    }
  }

  public handleCommentAdd(comment: string) {
    this.getToken()
    if(this.token && comment.length > 0) {
      this.profileService.addComment(1, comment, this.token).subscribe((data) => {
        if(data) {
          this.getComments();
        }
      })
    }
  }

  private getToken() {
    this.token = this.authService.getToken();
  }

  private clearInput() {
    if(this.commentInput) {
      this.commentInput.nativeElement.value = '';
    }
  }
}
