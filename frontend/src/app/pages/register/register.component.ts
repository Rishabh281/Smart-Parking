import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerData: any = { name: '', email: '', password: '', role: '' };

  constructor(private apiService: ApiService, private router: Router) {}

  doRegister() {
    if (!this.registerData.name.trim()) {
      alert('Name cannot be blank');
      return;
    }
    if (!this.registerData.email.trim()) {
      alert('Email cannot be blank');
      return;
    }
    if (!this.registerData.password.trim()) {
      alert('Password cannot be blank');
      return;
    }
    if (!this.registerData.role.trim()) {
      alert('Role cannot be blank');
      return;
    }

    this.apiService.register(this.registerData).subscribe({
      next: (response: any) => {
        console.log('Registration response:', response);

        if (response.message === 'success') {
          alert('Registration successful! Please log in.');
          this.router.navigate(['/login']);
        } else {
          alert(response.message || 'Registration failed');
        }
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert('An error occurred during registration. Please try again.');
      }
    });
  }
}
