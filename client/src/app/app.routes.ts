import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminsComponent } from './admins/admins.component';
import { PostsComponent } from './posts/posts.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminPanelComponent, children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'admins', component: AdminsComponent },
    { path: 'posts', component: PostsComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ] 
},
];
