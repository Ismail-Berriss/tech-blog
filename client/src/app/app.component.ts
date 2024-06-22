import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule  } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `<div>{{ data ? data.message : 'Loading...' }}</div>`,
  standalone: true,
  imports: [HttpClientModule ]
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
      });
  }

  ngOnDestroy() {
    // Cleanup if needed, similar to componentWillUnmount
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}


