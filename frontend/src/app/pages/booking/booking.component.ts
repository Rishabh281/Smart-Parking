import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent implements OnInit {
  userData: any;
  parkingData: any = {};
  bookingData: any = {
    registration: '',
    parkingid: '65e9621bd0f445c63fef5e7d',
    slot: '',
    reservetime: 0,
    status: '',
    userid: '',
  };
  apiStatus: any = '';
  userid: any = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
      this.userid = this.userData._id;
      this.getUserData(this.userid);
    } else {
      this.router.navigate(['/home']);
    }
    this.getParking();
  }

  slotSelect(slot: any) {
    this.bookingData.slot = slot;
  }

  getParking() {
    this.apiService.getParking().subscribe(
      (data: any) => {
        this.parkingData = data;
        console.log(this.parkingData, 'parking Data');
      },
      (error) => {
        console.error('Error fetching parking data', error);
      }
    );
  }

  getUserData(id: any) {
    this.apiService.getUserById(id).subscribe(
      (data: any) => {
        this.userData = data.data;
        console.log(this.userData, 'latest');
      },
      (error) => {
        console.error('Error fetching user data', error);
      }
    );
  }

  doBooking() {
    this.apiService.getParking().subscribe(
      (data: any) => {
        this.parkingData = data;
        if (this.parkingData[this.bookingData.slot] === 'vacant') {
          this.apiService.updateParking({ [this.bookingData.slot]: 'booked' }).subscribe(
            (data: any) => {
              this.apiStatus = data;
              if (this.apiStatus.message === 'success') {
                this.bookingData.status = 'booked';
                const currentTime: Date = new Date();
                currentTime.setMinutes(currentTime.getMinutes() + this.bookingData.reservetime);
                this.bookingData.reservetime = currentTime;
                this.bookingData.userid = this.userid;

                this.apiService.addBooking(this.bookingData).subscribe(
                  (data: any) => {
                    this.apiStatus = data;
                    if (this.apiStatus.message === 'success') {
                      this.apiService.updateUser({ booking: this.apiStatus.data._id }, this.userid).subscribe(
                        (data: any) => {
                          this.apiStatus = data;
                          if (this.apiStatus.message === 'success') {
                            this.userData = this.apiStatus.data;
                          } else {
                            console.error('Error updating user');
                          }
                        },
                        (error) => {
                          console.error('Error updating user', error);
                        }
                      );
                    }
                  },
                  (error) => {
                    console.error('Error adding booking', error);
                  }
                );
              }
            },
            (error) => {
              console.error('Error updating parking', error);
            }
          );
        } else {
          alert('Slot not available');
        }
      },
      (error) => {
        console.error('Error fetching parking data', error);
      }
    );
  }
}
