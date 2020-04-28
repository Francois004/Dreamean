import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalalbPage } from './modalalb.page';

const routes: Routes = [
  {
    path: '',
    component: ModalalbPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalalbPageRoutingModule {}
