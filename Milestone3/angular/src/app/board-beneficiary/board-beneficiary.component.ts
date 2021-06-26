import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-board-beneficiary',
  templateUrl: './board-beneficiary.component.html',
  styleUrls: ['./board-beneficiary.component.css']
})
export class BoardBeneficiaryComponent implements OnInit {
  content?: string;
  hasAccess = false;
  currentDate:number = Date.now();
  claimFailed = false;
  errorMessage = '';

  constructor(private userService: UserService, private authService: AuthService) { }

  //checks to see if the user has the right authorization to see page(beneficiary) role. And sets the variable has access to yes if they do.
  ngOnInit(): void {
    this.userService.getBeneficiaryBoard().subscribe(
      data => {
        this.content = data;
        this.hasAccess = true;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );


  }

  //When the user clicks the button checks database to see when they last claimed a token and if they are beneficiary. If successful adds token to account.
  claimToken(): void{
    this.currentDate = Date.now();
    console.log(this.currentDate);
    this.authService.claimToken(this.currentDate).subscribe(
      data => {
        this.claimFailed = false;
        alert("You have claimed a token. View profile to see how many you have");
      },
      err => {
        this.errorMessage = err.error.message;
        this.claimFailed = true;
              
      }
    );
  }
}
