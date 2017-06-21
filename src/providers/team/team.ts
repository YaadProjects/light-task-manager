import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { 
  AngularFireDatabase, 
  FirebaseObjectObservable,
  FirebaseListObservable } from 'angularfire2/database';

import firebase from 'firebase/app';

@Injectable()
export class TeamProvider {
  public userId:string;
  public teamId:string;
  constructor(public afAuth: AngularFireAuth, public afDb: AngularFireDatabase) {
    afAuth.authState.subscribe( user => { 
      this.userId = user.uid;
      
      afDb.object(`/userProfile/${user.uid}/`).subscribe( userProfile => {
        this.teamId = userProfile.teamId;
      });

    });
  }

  getAdminStatus(): Promise<any> {
    return new Promise( (resolve, reject) => {
       this.afDb.object(`/userProfile/${this.userId}/teamAdmin`)
       .subscribe( adminStatus => { resolve(adminStatus); });
    });
  }

  getUserProfile(): FirebaseObjectObservable<any> {
    return this.afDb.object(`/userProfile/${this.userId}/`);
  }

  getTeamMemberList(): FirebaseListObservable<any> {
    return this.afDb.list(`/teamProfile/${this.teamId}/teamMembers`);
  }

  getTeamProfile(): FirebaseObjectObservable<any> {
    return this.afDb.object(`/teamProfile/${this.teamId}`);
  }

  createTask(taskName:string, memberId:string, memberName:string): firebase.Promise<any> {
    return this.afDb.list(`/taskListByTeam/${this.teamId}/`)
      .push({ taskName, memberId, memberName, completed: false });
  }

  getTaskList(): FirebaseListObservable<any> {
    return this.afDb.list(`/taskListByTeam/${this.teamId}/`);
  }

  completeTask(taskId): firebase.Promise<any> {
    return this.afDb.object(`/taskListByTeam/${this.teamId}/${taskId}/`)
      .update({ completed: true });
  }

}
