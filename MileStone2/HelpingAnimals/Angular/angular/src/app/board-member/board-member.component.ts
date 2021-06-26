import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-board-member',
  templateUrl: './board-member.component.html',
  styleUrls: ['./board-member.component.css']
})
export class BoardMemberComponent implements OnInit {
  content?: string;
  hasAccess = false;
  form: any = {
    animalName: null,
    species: null,  
    description: null
  }
  isListingFailed = false;
  isListing = false;
  errorMessage = '';
  arrayOfAnimals: any[] = [];


  constructor(private userService: UserService, private authService: AuthService,  private token: TokenStorageService) { }

  //checks if the user has the memeber role and provides access if they do.
  ngOnInit(): void {

    this.userService.getMemberBoard().subscribe(
      data => {
        this.content = data;
        this.hasAccess = true;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );

    //fills an array of the animals the member has listed
    this.authService.getUserAnimals().subscribe(
      data => {
        console.log(data);
        this.arrayOfAnimals = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  
  
  }

  //code for when the user chooses to add a new animal. 
  onSubmit(): void {
    const { animalName, species, description } = this.form;

    this.authService.list(animalName, species, description).subscribe(
      data => {
        console.log(data);
        this.isListingFailed = false;
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isListingFailed = true;
      }
    );
  }

  //when the edit button is checked this opens the edit form, and if it's open it closes it.
  editListing(){

    if(this.isListing == false){
      this.isListing = true;
      console.log("Listing active");

    }
    else{
      this.isListing = false;
    }
}

//when delete button for an animal is clicked this will remove it from the database
deleteListing(animalId: string): void{

  this.authService.deleteAnimal(animalId).subscribe(
    data => {
      console.log(data);
      this.reloadPage();
    },
    err => {
      this.content = JSON.parse(err.error).message;
    }
  );

}




reloadPage(): void {
  window.location.reload();
}
}
