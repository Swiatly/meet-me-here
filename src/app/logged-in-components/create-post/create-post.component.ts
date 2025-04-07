import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  @ViewChild('postTitle') postTitle: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('postDesc') postDesc: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('postPicture') postPicture: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('modal') modal: ElementRef | undefined;

  constructor(private http: HttpClient, private authService: AuthService, private postService: PostService) { 
  }

  ngOnInit(): void {
    
  }

  public openModal() {
    this.modal?.nativeElement.classList.add('show');
    this.modal?.nativeElement.classList.remove('close');
  }

  public closeModal() {
    this.modal?.nativeElement.classList.add('close');
    this.modal?.nativeElement.classList.remove('add');
    this.clearPostForm();
  }

  public handlePost() {
    let title = this.postTitle?.nativeElement.value;
    let desc = this.postDesc?.nativeElement.value;
    let picture = this.postPicture?.nativeElement.value.slice(12);
    let token = this.authService.getToken();

    this.postService.createPost(title, desc, token, picture);
    
    this.closeModal();
  }

  private clearPostForm() {
    if(this.postTitle) {
      this.postTitle.nativeElement.value = '';
    }

    if(this.postDesc) {
      this.postDesc.nativeElement.value = '';
    }

    if(this.postPicture) {
      this.postPicture.nativeElement.value = '';
    }
  }
}

  
