import { Component, Input, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { AuthdataService } from 'src/app/authdata.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() show: boolean=false;

  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;
  constructor(private authData: AuthdataService) {
    
    this.firestore= new FirebaseTSFirestore();
    this.auth= new FirebaseTSAuth();
    
  }

  ngOnInit(): void {
  }

  onContinueClick(
    nameInput: HTMLInputElement,
    descriptionInput: HTMLTextAreaElement
  ){
    let name=nameInput.value;
    let description= descriptionInput.value;
    this.firestore.create(
      {
        path: ["Users",this.authData.getUid()],
        data: {
          publicName: name,
          description: description
        },
        onComplete: (docID) => {
          alert("Profile Created");
          nameInput.value="";
          descriptionInput.value="";
        },
        onFail: (err) => {
          alert("Profile not created");
        }
      }
    );
  }


}
