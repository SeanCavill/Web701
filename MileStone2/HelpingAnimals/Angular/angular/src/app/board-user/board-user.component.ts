import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';


@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
  content?: string;
  currentUser: any;
  arrayOfAnimals: any[] = [];
  focusedAnimal: any[] = [];
  isGridView = true;
  adoptFailed = false;
  errorMessage = '';


  constructor(private userService: UserService, private authService: AuthService, private token: TokenStorageService) { }

  ngOnInit(): void {

    this.userService.getUserBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }

    
    );

    //gets an array of animals that is to be displayed on the page
    this.authService.getAllAnimals().subscribe(
      data => {
        console.log(data);
        this.arrayOfAnimals = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );

  }


//runs when the user clicks on an animal. Gets all the details about the animal and switches the view.
openAnimal(animalId: string): void{

  this.authService.getAnimal(animalId).subscribe(
    data => {
      console.log(data);
      this.focusedAnimal.push(data);
      this.isGridView = false;

    },
    err => {
      this.errorMessage = err.error.message;
    }
  );
  }

  //on adoption click exhanghes user tokens(if the user doesn't have the beneficiary role they can't adopt) if user meets requirements
  //the animal is removed, and the lister of the animal earns a token.
  adoptAnimal(animalId: string): void{

    this.authService.adoptAnimal(animalId).subscribe(
      data => {
        console.log(data);
        this.reloadPage();
        this.currentUser = this.token.getUser();
        this.currentUser.tokens -= 1;
        this.token.saveUser(this.currentUser);

      },
      err => {
        this.errorMessage = err.error.message;
        this.adoptFailed = true;
      }
    );


}

reloadPage(): void {
  window.location.reload();
}

}


