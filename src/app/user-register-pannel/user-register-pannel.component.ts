import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-user-register-pannel',
    templateUrl: './user-register-pannel.component.html',
    styleUrls: ['./user-register-pannel.component.scss'],
})
export class UserRegisterPannelComponent implements OnInit {
    //Register variables
    @ViewChild('username') registerUsernameInput: ElementRef | undefined;
    @ViewChild('password') registerPasswordInput: ElementRef | undefined;
    @ViewChild('passwordRepeated') registerPasswordRepeatedInput: ElementRef | undefined;
    @ViewChild('firstname') registerFirstName: ElementRef | undefined;
    @ViewChild('lastname') registerLastName: ElementRef | undefined;

    //Form validators
    public usernameValid: boolean = true;
    public passwordValid: boolean = true;
    public repeatedPasswordValid: boolean = true;
    public firstnameValid: boolean = true;
    public lastnameValid: boolean = true;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {}

    public handleRegister(): void {
        if(this.usernameValid && this.passwordValid && this.repeatedPasswordValid && this.firstnameValid && this.lastnameValid) {
            if (this.registerUsernameInput && this.registerPasswordInput && this.registerPasswordRepeatedInput && this.registerFirstName && this.registerLastName) {
                this.authService.registerUser(
                    this.registerUsernameInput.nativeElement.value,
                    this.registerPasswordInput.nativeElement.value,
                    this.registerPasswordRepeatedInput.nativeElement.value,
                    this.registerFirstName.nativeElement.value,
                    this.registerLastName.nativeElement.value
                );
            }
        }
    }

    public vaildForm(type: string) {

        if(type === 'username' && this.registerUsernameInput) {
            let value = this.registerUsernameInput.nativeElement.value;
            if(value.length > 0) {
                this.usernameValid = true;
            }
            else {
                this.usernameValid = false;
            }
        }

        if(type === 'password' && this.registerPasswordInput) {
            let value = this.registerPasswordInput.nativeElement.value;
            if(value.length > 6) {
                this.passwordValid = true;
            }
            else {
                this.passwordValid = false;
            }
        }

        if(type === 'repeatedPassword' && this.registerPasswordRepeatedInput && this.registerPasswordInput) {
            let value = this.registerPasswordRepeatedInput.nativeElement.value;
            if(value === this.registerPasswordInput.nativeElement.value) {
                this.repeatedPasswordValid = true;
            }
            else {
                this.repeatedPasswordValid = false;
            }
        }

        if(type === 'firstname' && this.registerFirstName) {
            let value = this.registerFirstName.nativeElement.value;
            if( value.length > 0 ) {
                this.firstnameValid = true;
            }
            else {
                this.firstnameValid = false;
            }
        }

        if(type === 'lastname' && this.registerLastName) {
            let value = this.registerLastName.nativeElement.value;
            if( value.length > 0 ) {
                this.lastnameValid = true;
            }
            else {
                this.lastnameValid = false;
            }
        }
    }
}
