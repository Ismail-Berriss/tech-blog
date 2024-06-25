import { Component } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  signupForm: FormGroup;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      username: '',
      password: '',
    });

    this.loginForm = this.fb.group({
      username: '',
      password: '',
    });
  }

  onSignup() {
    const { username, password } = this.signupForm.value;

    axios
      .post('http://localhost:3000/api/signup', { username, password })
      .then((response) => {
        const { token, role } = response.data;

        localStorage.setItem('token', token);

        if (role === 'user') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/admin']);
        }
      })
      .catch((error) => {
        console.error('Signup failed', error);
      });
  }

  onLogin() {
    const { username, password } = this.loginForm.value;
    console.log(username);

    axios
      .post('http://localhost:3000/api/login', { username, password })
      .then((response) => {
        const { token, role } = response.data;

        localStorage.setItem('token', token);

        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      })
      .catch((error) => {
        console.error('Login failed', error);
      });
  }
}
