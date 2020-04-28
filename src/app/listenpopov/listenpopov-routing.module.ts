import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListenpopovPage } from './listenpopov.page';

const routes: Routes = [
  {
    path: '',
    component: ListenpopovPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListenpopovPageRoutingModule {}
