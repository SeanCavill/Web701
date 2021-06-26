import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent{
  
  title = 'ng-carousel-demo';

  
//An array of images that are used in the carousel. They contain the url the image is hosted at, a description, and the link which
//shows the page they will navigate to
  images = [

    {title: 'We need your help', short: 'Helping animals in Nelson', src: "https://picsum.photos/id/1062/900/500", link: 'login'},

    {title: 'Adopt', short: 'Become a beneficiary and start adopting today', src: "https://picsum.photos/id/237/900/500", link: 'user'},

    {title: 'Donate', short: 'Become a member and donate today', src: "https://picsum.photos/id/169/900/500", link: 'member'}


  ];

  
  //editing settings for how the carousel operates
  constructor(config: NgbCarouselConfig) {

    config.interval = 2000;

    config.keyboard = true;

    config.pauseOnHover = true;

  }
}
