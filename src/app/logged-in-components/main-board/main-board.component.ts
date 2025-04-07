import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'main-board',
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss']
})
export class MainBoardComponent implements OnInit {

  public posts: any = []

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.getPosts()
  }

  public getPosts() {
    this.http.get('http://localhost:3000/post', {headers: {
      "Authorization": `Bearer ${this.authService.getToken()}`
    }}).subscribe((data) => {
      this.posts = data;
    })
  }
}
