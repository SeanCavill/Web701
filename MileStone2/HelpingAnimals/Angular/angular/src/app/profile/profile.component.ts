import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  form: any = {
    username: null,  
    email: null,
    newpassword: null,
    password: null
  }
  isEditing = false;
  isLoggedIn = false;
  isUpdateFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private token: TokenStorageService) { }

  //checks to see if the user is logged in, and if so returns their data.
  ngOnInit(): void {

    this.authService.refreshUser().subscribe(
      data => {
        this.token.saveUser(data);
        this.currentUser = this.token.getUser();
        if (this.token.getToken()) {
        this.isLoggedIn = true;
        this.roles = this.token.getUser().roles;
    }
      },
      err => {
        console.log("Not logged in");
      }
    );

    
  }

  //opens up or closes form that allows edited data to be entered.
  editUser(){

      if(this.isEditing == false){
        this.isEditing = true;
        console.log("Editing account");
        this.form.username = this.currentUser.username;
        this.form.email = this.currentUser.email;
      }
      else{
        this.isEditing = false;
      }
  }

  //submits edited data to the database if validated. Creates the user a new token so it will log out other devices.
  onSubmit(): void {
    const { username, email, newpassword, password } = this.form;
    this.authService.update(username, email, newpassword, password).subscribe(
      data => {
        this.token.saveToken(data.accessToken);
        this.token.saveUser(data);
        this.isUpdateFailed = false;

        this.reloadPage();

      },
      err => {
        this.errorMessage = err.error.message;
        this.isUpdateFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
