import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { MainBoardComponent } from './logged-in-components/main-board/main-board.component';
import { SettingsComponent } from './logged-in-components/settings/settings.component';
import { FriendsListComponent } from './logged-in-components/friends-list/friends-list.component';
import { AppRoutingModule } from './app-routing.module';
import { ProfileComponent } from './logged-in-components/profile/profile.component';
import { PostComponent } from './logged-in-components/post/post.component';
import { CreatePostComponent } from './logged-in-components/create-post/create-post.component';
import { UserLoginPannelComponent } from './user-login-pannel/user-login-pannel.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NavbarComponent } from './logged-in-components/navbar/navbar.component';
import { HomeComponent } from './logged-in-components/home/home.component';
import { TodayDateComponent } from './logged-in-components/today-date/today-date.component';
import { CommentsComponent } from './logged-in-components/comments/comments.component';
import { UserRegisterPannelComponent } from './user-register-pannel/user-register-pannel.component';

@NgModule({
    declarations: [
        AppComponent,
        MainBoardComponent,
        SettingsComponent,
        FriendsListComponent,
        ProfileComponent,
        PostComponent,
        CreatePostComponent,
        UserLoginPannelComponent,
        UserRegisterPannelComponent,
        NavbarComponent,
        HomeComponent,
        TodayDateComponent,
        CommentsComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
