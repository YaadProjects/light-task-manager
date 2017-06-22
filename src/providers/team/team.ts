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
  constructor(public afAuth: AngularFireAuth, public afDb: AngularFireDatabase) {
    afAuth.authState.subscribe( user => { 
      this.userId = user.uid; 
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

  getMemberProfile(userId:string): FirebaseObjectObservable<any> {
    return this.afDb.object(`/userProfile/${userId}/`);
  }

  getTeamMemberList(teamId:string): FirebaseListObservable<any> {
    return this.afDb.list(`/teamProfile/${teamId}/teamMembers`);
  }

  getTeamProfile(teamId:string): any {
    return this.afDb.object(`/teamProfile/${teamId}`);
  }

  createTask(taskName:string, memberId:string, memberName:string, 
    memberEmail:string): firebase.Promise<any> {

    return this.afDb.list(`/taskListByTeam/${this.userId}/`)
      .push({ taskName, memberId, memberName, memberEmail, completed: false });
  }

  getTaskList(teamId:string): FirebaseListObservable<any> {
    return this.afDb.list(`/taskListByTeam/${teamId}/`);
  }

  completeTask(teamId:string, taskId:string): firebase.Promise<any> {
    return this.afDb.object(`/taskListByTeam/${teamId}/${taskId}/`)
      .update({ completed: true });
  }

}
