import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FriendsService } from 'src/app/services/friends.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild('modal') modal: ElementRef | undefined;
  


  public people: any = [];

  constructor(private authService: AuthService, private friends: FriendsService, private router: Router) { }

  ngOnInit(): void {
  }

  public handleSearch(content: string) {
    const token = this.authService.getToken()
    if(token) {
      this.friends.searchUser(content, token).subscribe(data => {
        this.people = data.users;
        this.openModal();
      })
    }
    else {
      this.router.navigate(["/login"])
    }
  }

  public openModal() {
    this.modal?.nativeElement.classList.add('show');
    this.modal?.nativeElement.classList.remove('close');
  }

  public closeModal() {
    this.modal?.nativeElement.classList.add('close');
    this.modal?.nativeElement.classList.remove('add');
    this.resetSearchBox();
    this.people = [];
  }

  public logout() {
    this.authService.logout()
  }

  @ViewChild('searchBox') searchBoxInput: ElementRef<HTMLInputElement> | undefined;

  private resetSearchBox() {
    if(this.searchBoxInput) {
      this.searchBoxInput.nativeElement.value = '';
    }
  }

}
