import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-user-login-pannel',
    templateUrl: './user-login-pannel.component.html',
    styleUrls: ['./user-login-pannel.component.scss'],
})
export class UserLoginPannelComponent implements OnInit {
    @ViewChild('loginUsername') loginUsernameInput: ElementRef | undefined;
    @ViewChild('loginPassword') loginPasswordInput: ElementRef | undefined;

    public usernameValid: boolean = true;
    public passwordValid: boolean = true;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {}

    public handleLogin(): void {
        if (this.loginUsernameInput && this.loginPasswordInput && this.usernameValid && this.passwordValid) {
            this.authService.loginUser(
                this.loginUsernameInput.nativeElement.value,
                this.loginPasswordInput.nativeElement.value
            );
        }
    }

    public validInput(type: string) {
        if (type === 'username' && this.loginUsernameInput) {
            if (this.loginUsernameInput.nativeElement.value.length > 0) {
                this.usernameValid = true;
            }
            else {
                this.usernameValid = false;
            }
        }

        if (type === 'password' && this.loginPasswordInput) {
            if (this.loginPasswordInput.nativeElement.value.length > 0) {
                this.passwordValid = true;
            }
            else {
                this.passwordValid = false;
            }
        }
    }
}
