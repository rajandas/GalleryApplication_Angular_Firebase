import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthdataService {

   uid: string="";

  constructor() {}

getUid(){
  return this.uid;
}

setUid(data?: string){
  if(data != null)
  this.uid=data;
}


}
