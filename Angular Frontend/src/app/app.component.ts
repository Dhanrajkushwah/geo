import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  [x: string]: any|string;
  isSidenavOpened = true;
  public isAuthenticated = false;
  boardId = '1'; 
  constructor(
    private router: Router
  ) {}

  ngOnInit() {


  }

  onSignIn() {
    this.router.navigate(['/auth']);
  }

  onSignUp() {
    this.router.navigate(['/auth']);
  }

  async onLogout() {
    // try {
    //   await this.appwriteService.logoutUser();
    //   Swal.fire({
    //     icon: 'success',
    //     title: 'Logged out!',
    //     text: 'You have been logged out successfully.',
    //     showConfirmButton: false,
    //     timer: 2000
    //   });
    //   this.router.navigate(['/auth']);
    // } catch (error) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Logout Failed',
    //     text: 'There was an issue logging out. Please try again.',
    //   });
    // }
  }

  onSettings() {
   
  }

  onThemes() {
    
  }
}
