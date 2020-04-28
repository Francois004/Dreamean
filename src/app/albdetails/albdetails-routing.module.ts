import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlbdetailsPage } from './albdetails.page';

const routes: Routes = [
  {
    path: '',
    component: AlbdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlbdetailsPageRoutingModule {}
