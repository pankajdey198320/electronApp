import { Component, OnInit,Input } from '@angular/core';
import {ContactServiceService} from '../contact-service.service';
import {ContactModel}from '../contact-model';
@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
  @Input() Contact: ContactModel;
  // Contact:ContactModel;
  constructor(private contactSvc:ContactServiceService) { }

  ngOnInit(): void {
  }
   AddNew(){
    this.Contact = { firstName:"first Name",lastName:"Last Name", email:"example@abc.com", phone:0} as ContactModel;
  }
   Save(){
    
    this.contactSvc.saveContacts(this.Contact);
  }
}
