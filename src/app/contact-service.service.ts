import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import {ContactModel} from './contact-model'

@Injectable({
  providedIn: 'root'
})
export class ContactServiceService {
  private _contacts:ContactModel[] = [];
  private readonly _ipc: any | undefined = undefined;
  constructor() {
    
    if (window.require) {
      try {
        this._ipc = window.require('electron').ipcRenderer;
        //this._ipc.setMaxListeners(0);
        //this.setListener();
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    
    }
   }
   public on(channel: string, listener: Function): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.on(channel, listener);
  }

  public send(channel: string, ...args): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.send(channel, ...args);
  }
  getConatcts():ContactModel[]{
    return this._contacts;
  }
  setConatcts(contacts:ContactModel[]):void{
    this._contacts =contacts;
  }
  saveContacts(contact:ContactModel):void{
    this._contacts.forEach(v=>{
      v.selected = false;
    });
    contact.selected = true;
    let mContact =this._contacts.find(v=>{
     return v.firstName == contact.firstName && v.lastName == contact.lastName
    });
    if(mContact !== undefined){
      mContact = contact;
    }
    else{
      this._contacts.push(contact);
    }
    this.send("save-contact",this._contacts);
  }
  deleteContacts(contact:ContactModel){
    let mContactIndex =this._contacts.findIndex(v=>{
      return v.firstName == contact.firstName && v.lastName == contact.lastName
     });
     if(mContactIndex !== undefined && mContactIndex >= 0){
      this._contacts.splice(mContactIndex,1) ; 
     }
     this.send("save-contact",this._contacts);
  }
  getContactsSortByFirstName():ContactModel[]{
    this._contacts.sort((a, b) => {
      let fa = a.firstName.toLowerCase(),
          fb = b.firstName.toLowerCase();
  
      if (fa < fb) {
          return -1;
      }
      if (fa > fb) {
          return 1;
      }
      return 0;
  });
  
  return this._contacts;
  }
  getContactsSortByLastName():ContactModel[]{
    this._contacts.sort((a, b) => {
      let fa = a.lastName.toLowerCase(),
          fb = b.lastName.toLowerCase();
  
      if (fa < fb) {
          return -1;
      }
      if (fa > fb) {
          return 1;
      }
      return 0;
  });
  
  return this._contacts;
  }
  search(searchString:string):ContactModel[]{
    return this._contacts.filter(v=>{
     return  v.firstName.startsWith(searchString) || v.lastName.startsWith(searchString)
    });
  }

  setSelectedContact(contact:ContactModel){
    this._contacts.forEach(v=>{
      v.selected = false;
    });
    contact.selected = true;
  }
  
}
