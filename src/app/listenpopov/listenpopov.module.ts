import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListenpopovPageRoutingModule } from './listenpopov-routing.module';

import { ListenpopovPage } from './listenpopov.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListenpopovPageRoutingModule
  ],
  declarations: [ListenpopovPage]
})
export class ListenpopovPageModule {}
