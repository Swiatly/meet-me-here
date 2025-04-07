import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public yesterday: string = new Date(new Date().setDate(new Date().getDate() -1)).toISOString().slice(0, 10);
  public token: string | null = '';
  public user: any;
  public defualtDate: any;

  @ViewChild('firstname') firstnameInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('lastname') lastnameInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('birthdayDate') birthdayDateInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('location') locationInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('biogram') biogramInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('picture') pictureInput: ElementRef<HTMLInputElement> | undefined;

  constructor(private profile: ProfileService ,private auth: AuthService) { }

  ngOnInit(): void {
    this.getToken();
    this.getUser();
  }

  public changeData(firstname: string, lastname: string, date: string, location: string, biogram: string, file: string) {
    
    let filename: string = ''

    if(file) {
      filename = file.slice(12)
    }
    
    this.profile.changeData(firstname, lastname, date, location, biogram, filename, this.token);
    window.alert("Zmiany zostały wprowadzone!");
  }

  private getUser() {
    this.user = this.auth.getUser();
    if(this.user.birthdate) {
      this.defualtDate = this.user.birthdate.split('T')[0];
    }
  }

  private getToken() {
    this.token = this.auth.getToken();
  }

}
