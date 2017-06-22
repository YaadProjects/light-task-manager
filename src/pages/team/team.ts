import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { TeamProvider } from '../../providers/team/team';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-team',
  templateUrl: 'team.html',
})
export class TeamPage {
  public teamProfile:any;
  public userProfile:any;
  constructor(public navCtrl:NavController, public alertCtrl:AlertController, 
    public teamProvider:TeamProvider, public authProvider:AuthProvider) {}

  ionViewDidLoad() {
    this.teamProvider.getUserProfile().subscribe( userProfile => {
      this.userProfile = userProfile;
      
      this.teamProvider.getTeamProfile(userProfile.teamId)
      .subscribe( teamProfileObservable => {
        this.teamProfile = teamProfileObservable;
      });
    });
  }

  inviteTeamMember(): void {
    let prompt = this.alertCtrl.create({
      title: 'Invite a team member',
      message: "Enter your coworker's email to send an invitation to use the app.",
      inputs: [
        {
          name: 'name',
          placeholder: "Your coworker's name",
          type: 'text'
        },
        {
          name: 'email',
          placeholder: "Your coworker's email",
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.authProvider.createMember(data.email, this.teamProfile.$key, data.name);
          }
        }
      ]
    });
    prompt.present();
  }

  goToMemberProfilePage(memberId): void {
    this.navCtrl.push('MemberProfilePage', {
      'memberId': memberId
    });
  }

}
