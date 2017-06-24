import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
  public pendingTaskList:any;
  public completedTaskList:any;
  constructor(public navCtrl:NavController, public teamProvider:TeamProvider, 
    public authProvider:AuthProvider, public navParams:NavParams,
    public alertCtrl:AlertController) {}

  
  ionViewDidLoad() {
    this.teamProvider.getUserProfile().subscribe( userProfileObservable => {
      this.userProfile = userProfileObservable;
    });

    this.teamProvider.getMemberProfile(this.navParams.get('memberId'))
    .subscribe( memberProfileObservable => {
      this.memberProfile = memberProfileObservable;

      this.teamProvider.getTaskList(memberProfileObservable.teamId)
      .subscribe( taskList => {
        this.pendingTaskList = taskList.filter(task => {
          return task.memberId === memberProfileObservable.$key && task.completed === false;
        });
        this.completedTaskList = taskList.filter(task => {
          return task.memberId === memberProfileObservable.$key && task.completed === true;
        });
      });
      
    });
  }

  completeTask(taskId:string): void {
    let confirm = this.alertCtrl.create({
      title: 'Are you done?',
      message: 'Hit OK to mark this task as completed.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { 
            console.log("Cancel clicked");
          }
        },
        {
          text: 'OK',
          handler: () => { 
            this.teamProvider.completeTask(this.userProfile.teamId, taskId);
          }
        }
      ]
    });
    confirm.present();
  }

  



}
