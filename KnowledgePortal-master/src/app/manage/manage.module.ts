import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { ManageRoutes } from './manage.routing';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { ManageGroupsComponent } from './groups/managegroups.component';
import { AddGroupComponent } from './groups/add/addgroup.component';
import { ManageMapsComponent } from './maps/managemaps.component';
import { EditModule } from '../edit/edit.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ManageRoutes),
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    TagInputModule,
    MaterialModule,
    EditModule
  ],
  declarations: [
      ManageGroupsComponent,
      AddGroupComponent,
      ManageMapsComponent
  ]
})

export class ManageModule {}
