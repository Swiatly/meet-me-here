import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'meet-me-here';

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.redirectIfNotLogged();
    }

    private redirectIfNotLogged(): void {
        this.authService.loginIfTokenActive();
    }
}
