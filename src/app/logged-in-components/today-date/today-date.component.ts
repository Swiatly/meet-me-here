import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-today-date',
  templateUrl: './today-date.component.html',
  styleUrls: ['./today-date.component.scss']
})
export class TodayDateComponent implements OnInit {

  public today: Date = new Date();

  constructor() {
  }

  ngOnInit(): void {
  }

}
