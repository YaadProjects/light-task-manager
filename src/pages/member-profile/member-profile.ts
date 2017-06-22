import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TeamProvider } from '../../providers/team/team';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-member-profile',
  templateUrl: 'member-profile.html',
})
export class MemberProfilePage {
  public userProfile:any;
  public memberId:string;
  public memberProfile:any;
  public taskList:any;
  constructor(public navCtrl:NavController, public teamProvider:TeamProvider, 
    public authProvider:AuthProvider, public navParams:NavParams) {}

  
  ionViewDidLoad() {
    this.teamProvider.getUserProfile().subscribe( userProfileObservable => {
      this.userProfile = userProfileObservable;
    });

    this.teamProvider.getMemberProfile(this.navParams.get('memberId'))
    .subscribe( memberProfileObservable => {
      this.memberProfile = memberProfileObservable;

      this.teamProvider.getTaskList(memberProfileObservable.teamId)
      .subscribe( taskList => {
        this.taskList = taskList.filter(task => {
          return task.memberId === memberProfileObservable.id;
        });
      });
      
    });
  }

  



}
