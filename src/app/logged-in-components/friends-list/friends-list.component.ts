import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss']
})
export class FriendsListComponent implements OnInit {

  @ViewChild('modal') modal: ElementRef | undefined;
  @Input('followers') followers: any = [];
  @Input('following') following: any = [];
  
  constructor() { }

  ngOnInit(): void {
  }

  public openModal() {
    this.modal?.nativeElement.classList.add('show');
    this.modal?.nativeElement.classList.remove('close');
  }

  public closeModal() {
    this.modal?.nativeElement.classList.add('close');
    this.modal?.nativeElement.classList.remove('add');
  }

}
