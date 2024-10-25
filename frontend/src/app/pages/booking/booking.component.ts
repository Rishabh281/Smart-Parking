import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent {
  userData: any;
  parkingData: any = {
    _id: '',
    parkingname: '',
    count: 0,
    p1: '',
    p2: '',
    p3: '',
    p4: '',
    p5: '',
    p6: '',
    p7: '',
    p8: '',
    p9: '',
    p10: '',
    p11: '',
    p12: '',
    p13: '',
    p14: '',
    updatedAt: '',
  };
  bookingData: any = {
    registration: '',
    parkingid: '65e9621bd0f445c63fef5e7d',
    slot: '',
    reservetime: '',
    status: '',
    userid: '',
  };
  apiStatus: any = '';
  userid: any = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadUserData()
    this.getParking();
  }

  loadUserData() {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
      this.userid = this.userData._id;
      this.getUserData(this.userid);
    } else {
      this.router.navigate(['/home']);
    }
  }

  slotSelect(slot: any) {
    this.bookingData.slot = slot;
  }

  getParking() {
    this.apiService.getParking().subscribe({
      next: (data: any) => {
        this.parkingData = data;
        console.log(this.parkingData, 'parking Data');
      },
      error: (err) => {
        console.error('Error fetching parking data', err);
      }
    });
  }
  getUserData(id: string) {
    this.apiService.getUserById(id).subscribe({
      next: (data: any) => {
        this.userData = data.data;
        console.log(this.userData, 'latest user data');
      },
      error: (err) => {
        console.error('Error fetching user data', err);
      }
    });
  }

  doBooking() {
    const selectedSlotStatus = this.parkingData.slots[this.bookingData.slot];
    
    if (selectedSlotStatus === 'vacant') {
      this.apiService.updateParking({ [this.bookingData.slot]: 'booked' }).subscribe({
        next: (data: any) => {
          this.apiStatus = data;

          if (this.apiStatus.message === 'success') {
            this.prepareBooking();
          }
        },
        error: (err) => {
          console.error('Error updating parking status', err);
        }
      });
    } else {
      alert('Slot not available');
    }
  }

  prepareBooking() {
    this.bookingData.status = 'booked';

    const currentTime: Date = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + this.bookingData.reservetime);
    this.bookingData.reservetime = currentTime;
    this.bookingData.userid = this.userid;

    this.apiService.addBooking(this.bookingData).subscribe({
      next: (data: any) => {
        this.apiStatus = data;
        if (this.apiStatus.message === 'success') {
          this.updateUserBooking();
        }
      },
      error: (err) => {
        console.error('Error adding booking', err);
      }
    });
  }

  updateUserBooking() {
    this.apiService.updateUser ({ booking: this.apiStatus.data._id }, this.userid).subscribe({
      next: (data: any) => {
        this.apiStatus = data;
        if (this.apiStatus.message === 'success') {
          this.userData = this.apiStatus.data;
          console.log('User  updated successfully', this.userData);
        } else {
          console.error('Error updating user');
        }
      },
      error: (err) => {
        console.error('Error updating user', err);
      }
    });
  }
}