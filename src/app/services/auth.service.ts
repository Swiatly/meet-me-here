import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const AUTH_TOKEN_LOCAL_STORAGE_KEY = 'meetmehere_auth_token';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnInit {
    private user: any;

    private authToken: string | null = null;

    constructor(private http: HttpClient, private router: Router) {}

    ngOnInit(): void {
        console.log(this.user);
    }

    public getToken(): string | null {
        
        return this.authToken;
    }

    public registerUser(
        username: string,
        password: string,
        repeatedPassword: string,
        firstName: string,
        lastName: string,
    ) {
        const response = this.http
            .post('/api/user/register', {
                username,
                password,
                repeatedPassword,
                firstName,
                lastName
            })
            .subscribe((data) => {
                window.alert('Zajerestrowano pomyślnie')
                this.router.navigate(["/login"])
            });
    }

    public loginUser(username: string, password: string) {
        return this.http
            .post<{ user: any; token: string }>('/api/user/login', {
                username,
                password,
            })
            .subscribe((data) => {
                if (data.user && data.token) {
                    this.user = data.user;
                    this.authToken = data.token;
                    localStorage.setItem(
                        AUTH_TOKEN_LOCAL_STORAGE_KEY,
                        data.token
                    );
                    this.router.navigate(['/home']);
                }
                else {
                    window.alert('Nieprawidłowe dane logowania')
                }
            });    
    }

    public loginIfTokenActive() {
        const token = localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE_KEY);
        if (!token) {
            this.router.navigate(['/login']);
            return;
        }
        this.authToken = token;
        
        this.http
            .get<{ user: any, followers: any[], followedUsers: any[] }>('/api/user/get-current-user', { headers: { authorization: `Bearer ${token}` } })
            .subscribe(
                (data) => {
                    this.user = data.user;
                    this.router.navigate(['/home']);
                },
                (error) => {
                    console.log(error);
                    
                    this.router.navigate(['/login']);
                    this.authToken = null;
                    localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY, '');
                }
            );
    }

    public getUser(): any {
        return this.user;
    }

    public logout(): void {
        this.authToken = null;
        this.user = null;
        localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY, '');
        this.router.navigate(["/login"])
    }

    public isLoggedIn(): boolean {
        return !!this.user;
    }

    //zwroci true albo false
}
