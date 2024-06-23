import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule  } from '@angular/common/http';
import { HomePageComponent } from './home-page/home-page.component';
import { Subscription } from 'rxjs';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';


@Component({
  selector: 'app-root',
  template: `<app-home-page></app-home-page>
  <div>{{ data ? data.message : 'Loading...' }}</div>`,
  standalone: true,
  imports: [HttpClientModule, HomePageComponent, LoginComponent, SignUpComponent]
})
export class AppComponent implements OnInit, OnDestroy {
  data: any;
  private subscription: Subscription | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Similar to componentDidMount:
    this.fetchData();
  }

  fetchData() {
    this.subscription = this.http.get('http://localhost:3000/api/message')
      .subscribe(result => {
        this.data = result;
        console.log(result);
      });
  }

  ngOnDestroy() {
    // Cleanup if needed, similar to componentWillUnmount
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}


