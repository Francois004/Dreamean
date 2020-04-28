import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GossipPageRoutingModule } from './gossip-routing.module';

import { GossipPage } from './gossip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GossipPageRoutingModule
  ],
  declarations: [GossipPage]
})
export class GossipPageModule {}
