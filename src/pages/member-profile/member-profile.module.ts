import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberProfilePage } from './member-profile';

@NgModule({
  declarations: [
    MemberProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(MemberProfilePage),
  ],
  exports: [
    MemberProfilePage
  ]
})
export class MemberProfilePageModule {}
