import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfiltabPage } from './profiltab.page';

const routes: Routes = [
  {
    path: '',
    component: ProfiltabPage ,
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfiltabPageRoutingModule {}
