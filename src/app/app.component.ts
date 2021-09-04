import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { AuthdataService } from './authdata.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gallery';
  auth = new FirebaseTSAuth();
  firestore: FirebaseTSFirestore;
  userHasProfile=true;
  hasEmailVarified= false;
  private static userDocument: any;

  constructor(private loginSheet: MatBottomSheet,
    private router:Router, private authData: AuthdataService
    ){
      this.firestore = new FirebaseTSFirestore();
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {
              
            },
            whenSignedOut: user => {
              AppComponent.userDocument = null;
              this.router.navigate(["home"]);
            },
            whenSignedInAndEmailNotVerified: user => {
              this.router.navigate(["emailVerification"]);    
            },
            whenSignedInAndEmailVerified: user =>{
              this.hasEmailVarified=true
              this.authData.setUid(user.uid);
              this.getUserProfile();
            },
            whenChanged: user =>{

            }
          }
        );
      }
    );

  }

  public static getUserDocument(){
    return AppComponent.userDocument;
  }

  getUsername(){
    try{
      return AppComponent.userDocument.publicName;
    }catch(err){
      
    }
  }

  getUserProfile(){

    this.firestore.listenToDocument(
      {       
        name: "Getting Document",
        path: ["Users",this.authData.getUid()],
        onUpdate: (result) =>{
          AppComponent.userDocument = <UserDocument> result.data();
          this.userHasProfile =result.exists;
          AppComponent.userDocument.userId=this.authData.getUid();
          if(this.userHasProfile){
            this.router.navigate(["postfeed"]);
          }
           
        }
      }
    );
    
  }

  onLogoutClick(){
    this.auth.signOut();
  }

  loggedIn(){
    return this.auth.isSignedIn();
  }

  onLoginClick(){
    this.loginSheet.open(AuthenticatorComponent);
  }
}

export interface UserDocument {
  publicName: String;
  description: String;
  userId: string;
}