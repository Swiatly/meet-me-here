import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './logged-in-components/profile/profile.component';
import { SettingsComponent } from './logged-in-components/settings/settings.component';
import { UserLoginPannelComponent } from './user-login-pannel/user-login-pannel.component';
import { UserRegisterPannelComponent } from './user-register-pannel/user-register-pannel.component';
import { HomeComponent } from './logged-in-components/home/home.component';

const routes: Routes = [
    {
        path: 'register',
        component: UserRegisterPannelComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'profile',
        component: ProfileComponent,
    },
    {
        path: 'profile/:id',
        component: ProfileComponent,
    },
    {
        path: 'settings',
        component: SettingsComponent,
    },
    {
        path: '', redirectTo: '/home', pathMatch: 'full'
    },
    {
        path: 'login',
        component: UserLoginPannelComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
