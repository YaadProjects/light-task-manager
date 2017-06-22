import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamProvider } from '../../providers/team/team';

@IonicPage()
@Component({
  selector: 'page-task-create',
  templateUrl: 'task-create.html',
})
export class TaskCreatePage {
  public memberList:Array<Object>;
  public createTaskForm:FormGroup;

  constructor(public navCtrl:NavController, public loadingCtrl:LoadingController, 
    formBuilder:FormBuilder, public teamProvider:TeamProvider) {

      this.createTaskForm = formBuilder.group({
        taskName: ['', Validators.required],
        teamMember: ['', Validators.required],
      });

    }

  ionViewDidEnter(){
    this.teamProvider.getUserProfile().subscribe( userProfileObservable => {
    this.teamProvider.getTeamMemberList(userProfileObservable.$key)
    .subscribe( teamListObservable => {
      this.memberList = teamListObservable;
    });
    });
  }

  createTask(){
    const loading = this.loadingCtrl.create();
    if (!this.createTaskForm.valid){
      console.log(this.createTaskForm.value);
    } else {
      this.teamProvider.createTask(this.createTaskForm.value.taskName,
        this.createTaskForm.value.teamMember.id,
        this.createTaskForm.value.teamMember.fullName,
        this.createTaskForm.value.teamMember.email)
      .then( () => {
        loading.dismiss().then( () => {
          this.navCtrl.pop();
        });
      });
    }
    loading.present();
  }

}
