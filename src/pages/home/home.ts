import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { TeamProvider } from '../../providers/team/team';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public isAdmin: boolean = false;
  public adminTaskList: Array<any> = [];
  public memberTaskList: Array<any> = [];
  public userProfile: any = {};

  constructor(public navCtrl:NavController, public alertCtrl:AlertController, 
    public teamProvider:TeamProvider) {}

  ionViewDidLoad() {
    this.teamProvider.getAdminStatus().then( adminStatus => {
      this.isAdmin = adminStatus;
    });

    this.teamProvider.getUserProfile().subscribe( profileSnapshot => {
      this.userProfile = profileSnapshot;

      this.teamProvider.getTaskList(profileSnapshot.teamId).subscribe( taskList => {
        this.adminTaskList = taskList;
        this.memberTaskList = taskList.filter(task => {
          return task.memberId === profileSnapshot.$key;
        });
      });
    });
  }

  goToTaskCreate(): void {
    this.navCtrl.push('TaskCreatePage');
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
