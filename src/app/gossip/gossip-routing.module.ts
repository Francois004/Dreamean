import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GossipPage } from './gossip.page';

const routes: Routes = [
  {
    path: '',
    component: GossipPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GossipPageRoutingModule {}
