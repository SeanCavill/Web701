import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showBeneficiaryBoard = false;
  showMemberBoard = false;
  username?: string;

  constructor(private tokenStorageService: TokenStorageService) { }

  //checks to see if the user is logged in and what pages they have access to.
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showBeneficiaryBoard = this.roles.includes('ROLE_BENEFICIARY');
      this.showMemberBoard = this.roles.includes('ROLE_MEMBER');

      this.username = user.username;
    }
  }

  //removes the token from local storage.
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
