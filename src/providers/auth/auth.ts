import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase/app';

@Injectable()
export class AuthProvider {

  constructor(public afAuth: AngularFireAuth, public afDb: AngularFireDatabase) {}

  createAdmin(email:string, password:string, fullName:string, 
    teamName:string): firebase.Promise<any>{

    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then( newUser => {
      this.afDb.object(`/userProfile/${newUser.uid}`)
        .set({
          email,
          fullName,
          teamId: newUser.uid,
          teamName,
          teamAdmin: true,
        }).then( () => {
          this.afDb.object(`/teamProfile/${newUser.uid}`)
          .set({ teamName, teamAdmin: newUser.uid });
        });
    }, error => { console.error(error); });
  }

  createMember(email:string, teamId:string, fullName:string): firebase.Promise<any> {
    return this.afDb.list(`teamProfile/${teamId}/teamMembers/`)
      .push({ fullName, email });
  }

  loginUser(email:string, password:string): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logoutUser(): firebase.Promise<void> {
    return this.afAuth.auth.signOut();
  }

  resetPassword(email:string): firebase.Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

}
