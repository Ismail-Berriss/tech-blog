import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'login', component: LoginComponent }
];
