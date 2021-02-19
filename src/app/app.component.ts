import { Component,OnInit,ChangeDetectorRef } from '@angular/core';
import {ContactServiceService} from './contact-service.service';
import {ContactModel}from './contact-model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public Contacts:ContactModel[] = [];
  searchString:string="";
  selectedContact :ContactModel;
  constructor(private contactSvc:ContactServiceService,private cd:ChangeDetectorRef){
   
    contactSvc.on('msg',(ev:any,data)=>{
      console.log(data);
    });
    contactSvc.on('contactLoaded',(ev:any,data)=>{
      contactSvc.setConatcts(data);
      this.Contacts =contactSvc.getConatcts();
      this.cd.detectChanges();
    });
    this.contactSvc.send('ping');
    
    //this.Contacts =contactSvc.getConatcts();
  }
  ngOnInit(): void {
    
  }
  ngAfterViewInit(){
    this.contactSvc.send('load-contact');
   
  }
  title = 'my-app';
  Sort(option:number):void{
    option === 1?
    this.Contacts =this.contactSvc.getContactsSortByFirstName():this.contactSvc.getContactsSortByLastName();
    this.searchString = '';
  }
  searchContacts(){
   this.Contacts=  this.contactSvc.search(this.searchString);
  }
  selectContact(contact:ContactModel){
    this.selectedContact = contact;
    this.contactSvc.setSelectedContact(contact);
    this.cd.detectChanges();
  }
  delete(contact:ContactModel){
    this.contactSvc.deleteContacts(contact);
    event.stopPropagation();
    this.selectedContact = null;
    this.cd.detectChanges();
  }
}
