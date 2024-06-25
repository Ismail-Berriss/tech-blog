import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `<app-header></app-header> <router-outlet></router-outlet>`,
  standalone: true,
  imports: [HeaderComponent, RouterModule],
})
export class AppComponent {}
