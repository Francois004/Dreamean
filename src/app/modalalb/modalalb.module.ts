import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalalbPageRoutingModule } from './modalalb-routing.module';

import { ModalalbPage } from './modalalb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalalbPageRoutingModule
  ],
  declarations: [ModalalbPage]
})
export class ModalalbPageModule {}
