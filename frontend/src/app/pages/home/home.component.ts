import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  userData: any;
  loginData: any = { password: '', email: '', role: '' };

  constructor(private apiService: ApiService, private router: Router ) {}

  doLogin() {
    if (!this.loginData.email.trim()) {
      alert('Email cannot be blank');
      return;
    }
    if (!this.loginData.password.trim()) {
      alert('Password cannot be blank');
      return;
    }
    if (!this.loginData.role.trim()) {
      alert('Role cannot be blank');
      return;
    }

    this.apiService.login(this.loginData).subscribe({
      next: (response: any) => {
        this.userData = response;
        console.log('User data:', this.userData);

        if (this.userData.message === 'success') {
          // Save user info and token to local storage
          localStorage.setItem('userData', JSON.stringify(this.userData.data));
          localStorage.setItem('token', JSON.stringify(this.userData.token));

          // Redirect to admin page
          this.router.navigate(['/admin']);
        } else {
          // Show error message from server
          alert(this.userData.message || 'Login failed');
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('An error occurred during login. Please try again.');
      }
    });
  }
}